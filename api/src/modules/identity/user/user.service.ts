import { UserInputError } from 'apollo-server-errors';
import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { UserUpdateInput, UserWhereUniqueInput } from '../../../../generated';
import { UserContext } from '../../../core';
import { BaseService } from '../../../core/base-service';
import { PermissionService } from '../../access-management/permission/permission.service';
import { UserRoleService } from '../../access-management/user-role/user-role.service';
import { FileService } from '../../core/file/file.service';
// import { FounderProfileService } from '../../founder/founder-profile/founder-profile.service';
import { AuthenticationService } from '../auth/auth.service';
import { UserInviteService } from '../user-invite/user-invite.service';
import { UserPlanRegistrationStatus } from '../user-plan-registration/user-plan-registration.model';
import { UserPlanRegistrationService } from '../user-plan-registration/user-plan-registration.service';
import { UserTypeService } from '../user_type/user_type.service';
import { User, UserStatus } from './user.model';
import { UserLoginInput, UserLoginResponse, UserRegisterInput } from './user.schema';

@Service('UserService')
export class UserService extends BaseService<User> {
  SYSTEM_USER_ID = '1';
  ANONYMOUS_USER_ID = '2';

  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    @Inject('AuthenticationService') public readonly authService: AuthenticationService,
    @Inject('PermissionService') public readonly permissionService: PermissionService,
    // @Inject('FounderProfileService') public readonly founderProfileService: FounderProfileService,
    @Inject('UserTypeService') public readonly userTypeService: UserTypeService,
    @Inject('UserInviteService') public readonly userInviteService: UserInviteService,
    @Inject('UserPlanRegistrationService')
    public readonly userPlanRegistrationService: UserPlanRegistrationService,
    @Inject('UserRoleService') public readonly userRoleService: UserRoleService,
    @Inject('FileService') public readonly fileService: FileService
  ) {
    super(User, repository);
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<User> {
    return this.repository.findOneOrFail({ stripeUserId: stripeCustomerId });
  }

  async findByEmailAddress(email: string): Promise<User> {
    return this.repository.findOneOrFail({ email: email });
  }
  async findById(id: string): Promise<User> {
    return this.repository.findOneOrFail({ id: id });
  }

  // founderProfilesByUserIds(users: readonly User[]) {
  //   return this.founderProfileService.find({ userId_in: users.map((user) => user.id) });
  // }

  // This assumes the user should only ever have one capability.
  @Transaction()
  async updateCapability(
    userId: string,
    type: string,
    @TransactionManager() transactionManager?: EntityManager
  ) {
    const manager = transactionManager || this.manager;
    await super.update({ capabilities: [type] }, { id: userId }, userId, {
      manager,
    });

    const userType = await this.userTypeService.findByType(type);

    await this.userRoleService.hardDelete({ userId }, manager);

    // Assigns the default role for this new user type
    await this.userRoleService.create({ userId, roleId: userType.defaultRoleId }, userId, {
      manager,
    });
  }

  async addCapability(userId: string, type: string, manager?: EntityManager) {
    // console.log(`addCapability :>> user ${userId} | type: ${type} `);
    const userType = await this.userTypeService.findByType(type);
    // console.log('userType :>> ', userType);

    // Assigns the default role for this new user type
    await this.userRoleService.create({ userId, roleId: userType.defaultRoleId }, userId, {
      manager,
    });
  }

  @Transaction()
  async update<W>(
    data: UserUpdateInput,
    where: W,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<User> {
    const manager = options?.manager || transactionManager;

    if (data.profilePictureFileId) {
      const file = await this.fileService.createFile({ url: data.profilePictureFileId }, userId);
      if (file) {
        data = { ...data, profilePictureFileId: file.id };
      }
    }

    const user = await super.update(data, where, userId, { manager });
    return user;
  }

  @Transaction()
  async register(
    data: UserRegisterInput,
    @TransactionManager() manager?: EntityManager
  ): Promise<User> {
    const userByEmail = await this.repository.findOne({ where: { email: data.email } });
    if (userByEmail) {
      throw new UserInputError('Failed to register user', {
        errors: {
          email: `User with email ${data.email} already exists`,
        },
      });
    }

    // Extract `type` as it is a custom field on register that allows us to add a user type
    const { type, ...userData } = data;
    let profilePicEntry = {};

    if (userData.profilePictureFileId) {
      const file = await this.fileService.createFile(
        { url: userData.profilePictureFileId },
        this.SYSTEM_USER_ID
      );
      if (file) {
        profilePicEntry = { profilePictureFileId: file.id };
      }
    }

    // Check to see if the user has paid
    // There is only 2 ways to register... paying to be a founder or investor
    // or getting an invite to be an internal user (see below)
    const registrations = await this.userPlanRegistrationService.find({
      status_eq: UserPlanRegistrationStatus.INPROGRESS,
      email_eq: data.email,
    });
    const registration = registrations[0];
    console.log('registration :>> ', registration);
    console.log('type :>> ', type);

    // If the user has registered, always pull the capability from the user_plan_registration table
    // otherwise we can take the type from the form, but we'll confirm it below
    const capability = registration ? registration.userType : type;
    // console.log('capability :>> ', capability);
    const userType = await this.userTypeService.findByType(capability);

    let user = await this.create(
      {
        ...userData,
        ...profilePicEntry,
        capabilities: [capability],
      },
      'system',
      { manager }
    );

    // If user is trying to register as a user type that is not allowed by the public,
    // make sure they've been invited to register as that type by looking for a user invite
    // Once we've confirmed this, set them to ACTIVE so that they don't need to onboard.
    if (!userType.allowedAtRegistration) {
      await this.userInviteService.accept(data.email, capability, user.id, { manager });
      user = await this.update({ status: UserStatus.ACTIVE } as any, { id: user.id }, user.id, {
        manager,
      });
    } else {
      // Otherwise, they should have paid (i.e. some flavor of founder or investor)
      // Check to make sure they've registered
      const stripeUserId = await this.userPlanRegistrationService.claim(data.email);
      // console.log('stripeUserId :>> ', stripeUserId);

      user = await this.update({ stripeUserId }, { id: user.id }, user.id, { manager });
    }

    // console.log('Adding capability', capability, user);
    await this.addCapability(user.id, capability, manager);

    return user;
  }

  // User status should be part of a state machine that other models don't know about.  This
  // is a naive state machine that only works for the one use case right now
  // Status = ONBOARDING, on: 'ONBOARDED'
  // This should be replaced by something like xstate: https://xstate.js.org/
  async updateStatus(
    userId: string,
    action: string,
    loggedInUserId: string,
    manager?: EntityManager
  ) {
    // console.log('updateStatus', userId, action, loggedInUserId);
    const user = await this.findOne({ id: userId });

    let nextStatus;

    if (user.status === 'INACTIVE' && action === 'START_ONBOARDING') {
      nextStatus = UserStatus.ONBOARDING;
    }

    if (user.status === 'ONBOARDING' && action === 'CREATE_INVESTOR') {
      nextStatus = UserStatus.ACTIVE;
    }

    if ((user.status === 'ONBOARDING' || user.status === 'INACTIVE') && action === 'CREATE_FOUNDER_PROFILE') {
      nextStatus = UserStatus.ONBOARDING_STARTUP;
    }

    if (user.status === 'ONBOARDING_STARTUP' && action === 'CREATE_STARTUP') {
      nextStatus = UserStatus.ACTIVE;
    }

    if (user.status === 'ACTIVE' && action === 'INACTIVE_USER') {
      nextStatus = UserStatus.INACTIVE;
    }

    if (user.status === 'INACTIVE' && action === 'ACTIVATE_USER') {
      nextStatus = UserStatus.ACTIVE;
    }

    //
    // Instead of throwing when couldn't determine nextStatus, do not update user's status
    // this because a bunch of tests fail and rely on that flawed boolean logic `user.status === 'ONBOARDING' || 'INACTIVE' && action === 'CREATE_FOUNDER_PROFILE'`
    //
    if (nextStatus) {
      return this.update({ status: nextStatus } as any, { id: userId }, loggedInUserId, { manager });
    }
    return user
  }

  async getUserToken(where: UserWhereUniqueInput, expiresIn?: string | number) {
    const user = await this.repository.findOne({
      where,
    });
    if (!user) {
      throw new Error(`Unable to find user where ${JSON.stringify(where)}`);
    }

    const tokenPayload: UserContext = {
      id: user.id,
      capabilities: user.capabilities,
      email: user.email,
      name: user.name,
      image: user.profilePictureFile?.url,
      status: user.status,
    };

    return this.authService.sign(tokenPayload, expiresIn);
  }

  async login(data: UserLoginInput): Promise<UserLoginResponse> {
    const { email, password } = data;
    const user = await this.repository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['profilePictureFile'],
    });
    // console.log('user :>> ', user);

    if (!user) {
      throw new Error('Invalid email/password');
    }

    if (!(await this.authService.verifyPassword(password, user.password))) {
      throw new Error('Invalid email/password');
    }

    await this.update({ lastLoginAt: new Date() } as any, { id: user.id }, user.id);

    // console.log('user.profilePictureFile.url :>> ', user.profilePictureFile?.url);

    const tokenPayload: UserContext = {
      id: user.id,
      capabilities: user.capabilities,
      email: user.email,
      name: user.name,
      image: user.profilePictureFile?.url,
      status: user.status,
    };
    // console.log('tokenPayload :>> ', tokenPayload);

    return {
      id: user.id,
      token: this.authService.sign(tokenPayload),
    };
  }

  // async updatePassword(id: string, password: string) {
  //   const user = await this.findOne({ id });
  //   if (!user || !(await user.comparePassword(password))) {
  //     throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
  //   }
  //   const newPassword = await bcrypt.hash(passwordNew, 10);
  //   await this.repository.update({ id }, { password: newPassword });
  // }
}

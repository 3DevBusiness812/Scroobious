import DataLoader from 'dataloader';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  UserCreateInput,
  UserUpdateArgs,
  UserWhereArgs,
  UserWhereUniqueInput,
} from '../../../../generated';
import { CurrentUser, Permission, Permissions } from '../../../core';
import { File } from '../../core/file/file.model';
import { FounderProfile } from '../../founder/founder-profile/founder-profile.model';
import { InvestorProfile } from '../../investor/investor-profile/investor-profile.model';
import { FounderProfileService } from '../../founder/founder-profile/founder-profile.service';
import { InvestorProfileService } from '../../investor/investor-profile/investor-profile.service';
import { PermissionService } from '../../access-management/permission/permission.service';
import { Plan } from '../../plan/plan.model';
import { JWTRequired } from '../auth/jwt-required.decorator';
import { Organization } from '../organization/organization.model';
import { User } from './user.model';
import { UserLoginInput, UserLoginResponse, UserRegisterInput } from './user.schema';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  founderProfileLoader: DataLoader<User, FounderProfile>;
  investorProfileLoader: DataLoader<User, InvestorProfile>;

  constructor(
    @Inject('UserService') public readonly service: UserService,
    @Inject('FounderProfileService') public readonly founderProfileService: FounderProfileService,
    @Inject('InvestorProfileService') public readonly investorProfileService: InvestorProfileService,
    @Inject('PermissionService') public readonly permissionService: PermissionService
  ) {
    this.founderProfileLoader = new DataLoader(async (users) => {
      // return this.service.founderProfilesByUserIds(users);
      // TODO: make sure we include empty objects for objects that don't exist
      return founderProfileService.find({ userId_in: users.map((user) => user.id) });
    });

    this.investorProfileLoader = new DataLoader(async (users) => {
      // return this.service.investorProfilesByUserIds(users);
      // TODO: make sure we include empty objects for objects that don't exist
      return investorProfileService.find({ userId_in: users.map((user) => user.id) });
    });
  }

  @FieldResolver(() => File)
  profilePictureFile(@Root() user: User, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.User.profilePictureFile.load(user);
  }

  // Note: 1:1 relationship Dataloaders don't work out of the box with Warthog right now, so we need to hand roll these
  //       The standard Warthog 1:1 dataloader expects a user.founder_profile_id column to be present, but that's not
  //       how we want to model it.  We want the foreign key in the founder_profile table
  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => FounderProfile)
  founderProfile(@Root() user: User): Promise<FounderProfile> {
    return this.founderProfileLoader.load(user);
  }

  @FieldResolver(() => FounderProfile)
  investorProfile(@Root() user: User): Promise<InvestorProfile> {
    return this.investorProfileLoader.load(user);
  }

  @FieldResolver(() => [Organization])
  organizations(@Root() user: User, @Ctx() ctx: BaseContext): Promise<Organization[]> {
    return ctx.dataLoader.loaders.User.organizations.load(user);
  }

  @FieldResolver(() => [Plan])
  plans(@Root() user: User, @Ctx() ctx: BaseContext): Promise<Plan[]> {
    return ctx.dataLoader.loaders.User.plans.load(user);
  }

  @Mutation(() => User)
  async register(@Arg('data') data: UserRegisterInput): Promise<User> {
    return this.service.register(data);
  }

  @Mutation(() => UserLoginResponse)
  async login(@Arg('data') data: UserLoginInput): Promise<UserLoginResponse> {
    return this.service.login(data);
  }

  @JWTRequired()
  @Query(() => User)
  async me(@UserId() userId: string) {
    return this.service.findOne({ id: userId });
  }

  @Query(() => [User])
  async users(
    @Args() { where, orderBy, limit, offset }: UserWhereArgs,
    @Fields() fields: string[],
    @UserId() userId: string
  ): Promise<User[]> {

    if (userId) {
      const permissions = await this.permissionService.permissionsForUser(userId);
      const hasUserListPermission = permissions.indexOf('user:list') > -1 || permissions.indexOf('system:admin') > -1;

      // Limit user query to retrieve only record about themselves if there is no user:list permission
      if (!hasUserListPermission) {
        where = {
          ...where,
          id_in: [userId]
        }
      }
    }

    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // Needed by NextAuth
  // TODO: NEED TO LOCK THIS DOWN
  // @Permission('user:list')
  @Query(() => User)
  async user(@Arg('where') where: UserWhereUniqueInput): Promise<User> {
    return this.service.findOne<UserWhereUniqueInput>(where);
  }

  // Needed by NextAuth
  // @Permission('user:create')
  @Mutation(() => User)
  async createUser(@Arg('data') data: UserCreateInput, @UserId() userId: string): Promise<User> {
    return this.service.create(data, userId);
  }

  // Needed by NextAuth
  // @Permission('user:create')
  @JWTRequired()
  @Mutation(() => User)
  async updateUser(
    @Args() { data, where }: UserUpdateArgs,
    @CurrentUser() user: User,
    @Permissions() permissions: string[],
    @UserId() userId: string
  ): Promise<User> {
    // TODO: need to "my world" this to users I have access to (i.e. "me")
    return this.service.update(data, where, userId);
  }

  // Needed by NextAuth
  // @Permission('user:create')
  @JWTRequired()
  @Mutation(() => User)
  async updateUserStatus(
    @Arg('userId') userId: string,
    @Arg('action') action: string,
    @UserId() loggedInUserId: string
  ): Promise<User> {
    // console.log('userId', userId);
    // console.log('action :>> ', action);

    // TODO: need to "my world" this to users I have access to (i.e. "me")
    return this.service.updateStatus(userId, action, loggedInUserId);
  }

  // Needed by NextAuth
  @Permission('user:delete')
  @Mutation(() => StandardDeleteResponse)
  async deleteUser(
    @Arg('where') where: UserWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

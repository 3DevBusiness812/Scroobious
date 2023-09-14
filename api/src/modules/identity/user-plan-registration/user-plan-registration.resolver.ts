import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import { UserPlanRegistrationCreateInput } from '../../../../generated';
import { UserService } from '../user/user.service';
import { UserPlanRegistration } from './user-plan-registration.model';
import { UserPlanRegistrationService } from './user-plan-registration.service';

@Resolver(UserPlanRegistration)
export class UserPlanRegistrationResolver {
  constructor(
    @Inject('UserPlanRegistrationService') public readonly service: UserPlanRegistrationService,
    @Inject('UserService') public readonly userService: UserService
  ) {}

  @Mutation(() => UserPlanRegistration)
  async createUserPlanRegistration(
    @Arg('data') data: UserPlanRegistrationCreateInput,
    @UserId() userId: string
  ): Promise<UserPlanRegistration> {
    return this.service.create({ ...data, userId }, this.userService.SYSTEM_USER_ID);
  }
}

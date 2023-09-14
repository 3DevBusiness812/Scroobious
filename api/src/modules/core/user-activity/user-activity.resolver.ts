import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import { UserActivityCreateInput } from '../../../../generated';
import { UserActivity } from './user-activity.model';
import { UserActivityService } from './user-activity.service';

@Resolver(UserActivity)
export class UserActivityResolver {
  constructor(@Inject('UserActivityService') public readonly service: UserActivityService) {}

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => UserActivity)
  async createUserActivity(
    @Arg('data') data: UserActivityCreateInput,
    @UserId() userId: string
  ): Promise<UserActivity> {
    return this.service.create(data, userId);
  }
}

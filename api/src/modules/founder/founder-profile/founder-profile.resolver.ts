import { Arg, Args, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import { FounderProfileCreateInput, FounderProfileUpdateArgs } from '../../../../generated';
import { FounderProfile } from './founder-profile.model';
import { FounderProfileService } from './founder-profile.service';

@Resolver(FounderProfile)
export class FounderProfileResolver {
  constructor(@Inject('FounderProfileService') public readonly service: FounderProfileService) {}

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => FounderProfile)
  async createFounderProfile(
    @Arg('data') data: FounderProfileCreateInput,
    @UserId() userId: string
  ): Promise<FounderProfile> {
    return this.service.create(data, userId);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => FounderProfile)
  async updateFounderProfile(
    @Args() { data, where }: FounderProfileUpdateArgs,
    @UserId() userId: string
  ): Promise<FounderProfile> {
    return this.service.update(data, where, userId);
  }
}

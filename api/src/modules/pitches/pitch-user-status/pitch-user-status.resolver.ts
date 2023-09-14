import { Arg, Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import {
  PitchUserStatusUpdateInput,
  PitchUserStatusWhereInput,
  PitchUserStatusWhereUniqueInput,
} from '../../../../generated';
import { UpsertAction } from '../../../core';
import { PitchUserStatus } from './pitch-user-status.model';
import { PitchUserStatusService } from './pitch-user-status.service';

@ArgsType()
export class PitchUserStatusUpsertArgs {
  @Field() data!: PitchUserStatusUpdateInput;
  @Field() where!: PitchUserStatusWhereInput;
}

@ObjectType()
export class PitchUserStatusUpsertResult {
  @Field(() => PitchUserStatus)
  data!: PitchUserStatus;

  @Field(() => UpsertAction)
  action!: UpsertAction;
}

@Resolver(PitchUserStatus)
export class PitchUserStatusResolver {
  constructor(@Inject('PitchUserStatusService') public readonly service: PitchUserStatusService) {}

  // TODO:   @RequirePermission('pitch:admin')
  @Query(() => PitchUserStatus, { nullable: true })
  async pitchUserStatus(
    @Arg('where') where: PitchUserStatusWhereUniqueInput
  ): Promise<PitchUserStatus | undefined> {
    return this.service.findOneSafe<PitchUserStatusWhereUniqueInput>(where);
  }

  @Query(() => [PitchUserStatus], { nullable: true })
  async pitchUserStatuses(
    @Arg('where') where: PitchUserStatusWhereInput
  ): Promise<PitchUserStatus[]> {
    return this.service.find(where);
  }

  // TODO: @RequirePermission('pitchuserstatus:admin')
  @Mutation(() => PitchUserStatusUpsertResult)
  async upsertPitchUserStatus(
    @Args() { data, where }: PitchUserStatusUpsertArgs,
    @UserId() userId: string
  ): Promise<PitchUserStatusUpsertResult> {
    return this.service.upsert(data, where, userId);
  }
}

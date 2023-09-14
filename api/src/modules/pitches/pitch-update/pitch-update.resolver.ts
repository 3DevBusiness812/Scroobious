import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, UserId } from 'warthog';
import { PitchUpdateCreateInput } from '../../../../generated';
import { UserSafe } from '../../identity/user/user.model';
import { PitchUpdate } from './pitch-update.model';
import { PitchUpdateService } from './pitch-update.service';

// TODO: add startup_profile directly to pitch

@Resolver(PitchUpdate)
export class PitchUpdateResolver {
  constructor(@Inject('PitchUpdateService') public readonly service: PitchUpdateService) {}

  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => UserSafe)
  createdBy(@Root() pitchUpdate: PitchUpdate, @Ctx() ctx: BaseContext): Promise<UserSafe> {
    return ctx.dataLoader.loaders.PitchUpdate.createdBy.load(pitchUpdate);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => PitchUpdate)
  async createPitchUpdate(
    @Arg('data') data: PitchUpdateCreateInput,
    @UserId() userId: string
  ): Promise<PitchUpdate> {
    return this.service.create(data, userId);
  }
}

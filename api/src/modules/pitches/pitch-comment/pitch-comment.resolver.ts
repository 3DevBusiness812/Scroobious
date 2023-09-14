import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, UserId } from 'warthog';
import { PitchCommentCreateInput } from '../../../../generated';
import { UserSafe } from '../../identity/user/user.model';
import { PitchComment } from './pitch-comment.model';
import { PitchCommentService } from './pitch-comment.service';

// TODO: add startup_profile directly to pitch

@Resolver(PitchComment)
export class PitchCommentResolver {
  constructor(@Inject('PitchCommentService') public readonly service: PitchCommentService) {}

  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => UserSafe)
  createdBy(@Root() pitchComment: PitchComment, @Ctx() ctx: BaseContext): Promise<UserSafe> {
    return ctx.dataLoader.loaders.PitchComment.createdBy.load(pitchComment);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => PitchComment)
  async createPitchComment(
    @Arg('data') data: PitchCommentCreateInput,
    @UserId() userId: string
  ): Promise<PitchComment> {
    return this.service.create(data, userId);
  }
}

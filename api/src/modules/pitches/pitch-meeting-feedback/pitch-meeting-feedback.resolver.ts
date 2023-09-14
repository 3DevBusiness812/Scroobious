import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import {BaseContext, StandardDeleteResponse, UserId} from 'warthog'
import {
  FileCreateInput,
  PitchMeetingFeedbackWhereArgs,
  PitchMeetingFeedbackWhereUniqueInput,
} from '../../../../generated'
import { Permission } from '../../../core/decorators';
import { File } from '../../core/file/file.model';
import { UserSafe } from '../../identity/user/user.model';
import { Pitch } from '../pitch/pitch.model';
import { PitchMeetingFeedback } from './pitch-meeting-feedback.model';
import { PitchMeetingFeedbackService } from './pitch-meeting-feedback.service';

@InputType()
export class PitchMeetingFeedbackRequestInput {
  @Field()
  pitchId!: string;

  @Field()
  courseProductId!: string;

  @Field()
  ownerId!: string;
}

@InputType()
export class PitchMeetingFeedbackAssignInput {
  @Field()
  reviewerId!: string;
}

@InputType()
export class PitchMeetingFeedbackCompleteInput {
  @Field()
  file!: FileCreateInput;

  @Field({ nullable: true })
  reviewerNotes?: string;
}

@Resolver(PitchMeetingFeedback)
export class PitchMeetingFeedbackResolver {
  constructor(
    @Inject('PitchMeetingFeedbackService') public readonly service: PitchMeetingFeedbackService
  ) {}

  // TODO: Lock this down
  @FieldResolver(() => Pitch)
  pitch(
    @Root() pitchMeetingFeedback: PitchMeetingFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<Pitch> {
    return ctx.dataLoader.loaders.PitchMeetingFeedback.pitch.load(pitchMeetingFeedback);
  }

  // TODO: Lock this down
  @FieldResolver(() => File)
  recordingFile(
    @Root() pitchMeetingFeedback: PitchMeetingFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<File> {
    return ctx.dataLoader.loaders.PitchMeetingFeedback.recordingFile.load(pitchMeetingFeedback);
  }

  // TODO: Lock this down
  @FieldResolver(() => UserSafe)
  reviewer(
    @Root() pitchMeetingFeedback: PitchMeetingFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<UserSafe> {
    return ctx.dataLoader.loaders.PitchMeetingFeedback.reviewer.load(pitchMeetingFeedback);
  }

  @Permission(['pitch_meeting_feedback:list'])
  @Query(() => [PitchMeetingFeedback])
  async pitchMeetingFeedbacks(
    @Args() { where, orderBy, limit, offset }: PitchMeetingFeedbackWhereArgs,
    // @Fields() fields: string[],
    @UserId() userId: string
  ): Promise<PitchMeetingFeedback[]> {
    return this.service.find(where, orderBy, limit, offset, undefined, userId);
  }

  @Permission(['pitch_meeting_feedback:list'])
  @Query(() => PitchMeetingFeedback)
  async pitchMeetingFeedback(
    @Arg('where') where: PitchMeetingFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchMeetingFeedback> {
    return this.service.findOne<PitchMeetingFeedbackWhereUniqueInput>(where, userId);
  }


  @Permission(['pitch_meeting_feedback:request', 'pitch_meeting_feedback:admin'])
  @Mutation(() => PitchMeetingFeedback)
  async requestPitchMeetingFeedback(
    @Arg('data') data: PitchMeetingFeedbackRequestInput,
    @UserId() userId: string
  ): Promise<PitchMeetingFeedback> {
    return this.service.request(data, userId);
  }

  @Permission('pitch_meeting_feedback:admin')
  @Mutation(() => PitchMeetingFeedback)
  async assignPitchMeetingFeedback(
    @Arg('data') data: PitchMeetingFeedbackAssignInput,
    @Arg('where') where: PitchMeetingFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchMeetingFeedback> {
    return this.service.assign(data, where, userId);
  }

  @Permission('pitch_meeting_feedback:admin')
  @Mutation(() => PitchMeetingFeedback)
  async completePitchMeetingFeedback(
    @Arg('data') data: PitchMeetingFeedbackCompleteInput,
    @Arg('where') where: PitchMeetingFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchMeetingFeedback> {
    return this.service.complete(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deletePitchMeetingFeedback(
      @Arg('where') where: PitchMeetingFeedbackWhereUniqueInput,
      @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

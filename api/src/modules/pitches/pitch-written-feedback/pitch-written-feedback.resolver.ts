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
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import {BaseContext, StandardDeleteResponse, UserId} from 'warthog'
import {
  PitchDeckWhereUniqueInput,
  PitchWrittenFeedbackWhereArgs,
  PitchWrittenFeedbackWhereUniqueInput,
} from '../../../../generated';
import { Permission } from '../../../core';
import { UserSafe } from '../../identity/user/user.model';
import { PitchDeck } from '../pitch-deck/pitch-deck.model';
import { PitchDeckCreateExtendedInput } from '../pitch-deck/pitch-deck.resolver';
import { Pitch } from '../pitch/pitch.model';
import { PitchWrittenFeedback } from './pitch-written-feedback.model';
import { PitchWrittenFeedbackService } from './pitch-written-feedback.service';

@InputType()
export class PitchWrittenFeedbackRequestInput {
  @Field()
  pitchId!: string;

  @Field()
  pitchDeck!: PitchDeckCreateExtendedInput;
  // pitchDeck!: PitchDeckWhereUniqueInput;

  @Field()
  courseProductId!: string;
}

@InputType()
export class PitchWrittenFeedbackRequestRetainDeckInput {
  @Field()
  pitchId!: string;

  @Field()
  pitchDeck!: PitchDeckWhereUniqueInput;

  @Field()
  courseProductId!: string;
}

@InputType()
export class PitchWrittenFeedbackAssignInput {
  @Field()
  reviewerId!: string;
}

@InputType()
export class PitchWrittenFeedbackCompleteInput {
  @Field()
  pitchDeck!: PitchDeckCreateExtendedInput;

  @Field({ nullable: true })
  reviewerNotes?: string;
}

@Resolver(PitchWrittenFeedback)
export class PitchWrittenFeedbackResolver {
  constructor(
    @Inject('PitchWrittenFeedbackService') public readonly service: PitchWrittenFeedbackService
  ) {}

  // TODO: Lock this down
  @FieldResolver(() => Pitch)
  pitch(
    @Root() pitchWrittenFeedback: PitchWrittenFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<Pitch> {
    return ctx.dataLoader.loaders.PitchWrittenFeedback.pitch.load(pitchWrittenFeedback);
  }

  // TODO: Lock this down
  @FieldResolver(() => PitchDeck)
  originalPitchDeck(
    @Root() pitchWrittenFeedback: PitchWrittenFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<PitchDeck> {
    return ctx.dataLoader.loaders.PitchWrittenFeedback.originalPitchDeck.load(pitchWrittenFeedback);
  }

  // TODO: Lock this down
  @FieldResolver(() => PitchDeck)
  reviewedPitchDeck(
    @Root() pitchWrittenFeedback: PitchWrittenFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<PitchDeck> {
    return ctx.dataLoader.loaders.PitchWrittenFeedback.reviewedPitchDeck.load(pitchWrittenFeedback);
  }

  // TODO: Lock this down
  @FieldResolver(() => UserSafe)
  reviewer(
    @Root() pitchWrittenFeedback: PitchWrittenFeedback,
    @Ctx() ctx: BaseContext
  ): Promise<UserSafe> {
    return ctx.dataLoader.loaders.PitchWrittenFeedback.reviewer.load(pitchWrittenFeedback);
  }

  @Permission(['pitch_written_feedback:list'])
  @Query(() => [PitchWrittenFeedback])
  async pitchWrittenFeedbacks(
    @Args() { where, orderBy, limit, offset }: PitchWrittenFeedbackWhereArgs,
    // @Fields() fields: string[],
    @UserId() userId: string
  ): Promise<PitchWrittenFeedback[]> {
    return this.service.find(where, orderBy, limit, offset, undefined, userId);
  }

  @Permission(['pitch_written_feedback:list'])
  @Query(() => PitchWrittenFeedback)
  async pitchWrittenFeedback(
    @Arg('where') where: PitchWrittenFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchWrittenFeedback> {
    return this.service.findOne<PitchWrittenFeedbackWhereUniqueInput>(where, userId);
  }

  // BEST_PRACTICE: this is how we should do transactions for a whole API endpoint
  // This will cause it to either commit everything or fail it
  @Transaction()
  @Permission('pitch_written_feedback:request')
  @Mutation(() => PitchWrittenFeedback)
  async requestPitchWrittenFeedback(
    @Arg('data') data: PitchWrittenFeedbackRequestInput,
    @UserId() userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<PitchWrittenFeedback> {
    return await this.service.request(data, userId, { manager }); // Need to wait for transaction
  }

  @Transaction()
  @Permission('pitch_written_feedback:request')
  @Mutation(() => PitchWrittenFeedback)
  async requestPitchWrittenFeedbackRetainDeck(
    @Arg('data') data: PitchWrittenFeedbackRequestRetainDeckInput,
    @UserId() userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<PitchWrittenFeedback> {
    return await this.service.requestFeedback(data, userId, { manager }); // Need to wait for transaction
  }

  @Permission('pitch_written_feedback:admin')
  @Mutation(() => PitchWrittenFeedback)
  async assignPitchWrittenFeedback(
    @Arg('data') data: PitchWrittenFeedbackAssignInput,
    @Arg('where') where: PitchWrittenFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchWrittenFeedback> {
    return this.service.assign(data, where, userId);
  }

  @Permission('pitch_written_feedback:admin')
  @Mutation(() => PitchWrittenFeedback)
  async completePitchWrittenFeedback(
    @Arg('data') data: PitchWrittenFeedbackCompleteInput,
    @Arg('where') where: PitchWrittenFeedbackWhereUniqueInput,
    @UserId() userId: string
  ): Promise<PitchWrittenFeedback> {
    return this.service.complete(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deletePitchWrittenFeedback(
      @Arg('where') where: PitchWrittenFeedbackWhereUniqueInput,
      @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

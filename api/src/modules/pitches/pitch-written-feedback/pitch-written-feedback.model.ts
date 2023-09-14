import { JoinColumn } from 'typeorm';
import {
  BaseModel,
  CreatedAtField,
  EnumField,
  IdField,
  IDType,
  ManyToOne,
  Model,
  OneToOne,
  StringField,
} from 'warthog';
import { CourseProduct } from '../../courses/course-product/course-product.model';
import { User } from '../../identity/user/user.model';
import { PitchDeck } from '../pitch-deck/pitch-deck.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchWrittenFeedbackStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  ASSIGNED = 'ASSIGNED',
  COMPLETE = 'COMPLETE',
  AWAITING_QA = 'AWAITING_QA',
}

@Model()
export class PitchWrittenFeedback extends BaseModel {
  @EnumField('PitchWrittenFeedbackStatus', PitchWrittenFeedbackStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: PitchWrittenFeedbackStatus.REQUESTED,
  })
  status!: PitchWrittenFeedbackStatus;

  @ManyToOne(() => Pitch, 'pitchWrittenFeedbacks')
  pitch!: Pitch;

  @IdField()
  pitchId!: IDType;

  @OneToOne(() => PitchDeck, 'pitchWrittenFeedback', { nullable: true })
  @JoinColumn()
  originalPitchDeck!: PitchDeck;

  @IdField({ nullable: true, computed: true })
  originalPitchDeckId!: IDType;

  @OneToOne(() => PitchDeck, 'pitchWrittenFeedback', { nullable: true })
  @JoinColumn()
  reviewedPitchDeck!: PitchDeck;

  @IdField({ nullable: true, computed: true })
  reviewedPitchDeckId!: IDType;

  @StringField({ nullable: true })
  reviewerNotes?: string;

  @ManyToOne(() => CourseProduct, 'pitchWrittenFeedbacks')
  courseProduct!: CourseProduct;

  @StringField({ filter: ['eq'] })
  courseProductId!: string;

  @ManyToOne(() => User, 'pitchWrittenFeedbackReviewers', { nullable: true })
  reviewer!: User;

  @IdField({ nullable: true, computed: true })
  reviewerId!: IDType;

  // Need to override defaults to get sorting, filtering, etc...
  @CreatedAtField({ sort: true })
  declare createdAt: Date;
}

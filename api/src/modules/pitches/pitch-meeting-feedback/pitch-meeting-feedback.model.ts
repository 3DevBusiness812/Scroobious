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
import { File } from '../../core/file/file.model';
import { CourseProduct } from '../../courses/course-product/course-product.model';
import { User } from '../../identity/user/user.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchMeetingFeedbackStatus {
  REQUESTED = 'REQUESTED',
  ASSIGNED = 'ASSIGNED',
  COMPLETE = 'COMPLETE',
}

@Model()
export class PitchMeetingFeedback extends BaseModel {
  @EnumField('PitchMeetingFeedbackStatus', PitchMeetingFeedbackStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: PitchMeetingFeedbackStatus.REQUESTED,
  })
  status!: PitchMeetingFeedbackStatus;

  @ManyToOne(() => Pitch, 'pitchMeetingFeedbacks')
  pitch!: Pitch;

  @IdField()
  pitchId!: IDType;

  @OneToOne(() => File, 'pitchMeetingFeedbackRecording', { nullable: true })
  @JoinColumn()
  recordingFile?: File;

  @IdField({ computed: true, nullable: true })
  recordingFileId?: IDType;

  @StringField({ nullable: true })
  reviewerNotes?: string;

  @ManyToOne(() => CourseProduct, 'pitchMeetingFeedbacks')
  courseProduct!: CourseProduct;

  @StringField({ filter: ['eq'] })
  courseProductId!: string;

  @ManyToOne(() => User, 'pitchMeetingFeedbackReviewers', { nullable: true })
  reviewer!: User;

  @IdField({ nullable: true })
  reviewerId!: IDType;

  // Need to override defaults to get sorting, filtering, etc...
  @CreatedAtField({ sort: true })
  declare createdAt: Date;
}

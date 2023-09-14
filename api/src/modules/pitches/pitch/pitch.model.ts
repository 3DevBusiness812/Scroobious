// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import {
  BaseModel,
  BooleanField,
  CreatedAtField,
  UpdatedAtField,
  EnumField,
  IdField,
  IDType,
  IntField,
  ManyToOne,
  Model,
  OneToMany,
  OneToOne,
  StringField,
} from 'warthog';
import { Course } from '../../courses/course/course.model';
import { Organization } from '../../identity/organization/organization.model';
import { User } from '../../identity/user/user.model';
import { PitchComment } from '../pitch-comment/pitch-comment.model';
import { PitchDeck } from '../pitch-deck/pitch-deck.model';
import { PitchUpdate } from '../pitch-update/pitch-update.model';
import { PitchUserStatus } from '../pitch-user-status/pitch-user-status.model';
import { PitchVideo } from '../pitch-video/pitch-video.model';

// Pitches start in DRAFT
// When the user goes through the PiP, it switches to ACTIVE
// Only a "reviewer" role can move the pitch to "PUBLISHED"
export enum PitchStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PUBLISHED = 'PUBLISHED',
}
@Model()
export class Pitch extends BaseModel {
  @EnumField('PitchStatus', PitchStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: PitchStatus.DRAFT,
  })
  status!: PitchStatus;

  @ManyToOne(() => User, (user: User) => user.pitches)
  user!: User;
  @IdField({ computed: true, filter: ['eq', 'in'] })
  userId!: IDType;

  @ManyToOne(() => Organization, (organization: Organization) => organization.pitches)
  organization!: Organization;
  @IdField({ filter: ['eq', 'in'], computed: true })
  organizationId!: IDType;

  @ManyToOne(() => User, (user: User) => user.pitches)
  createdBy!: User;

  @IdField({ computed: true })
  declare createdById: IDType;

  @ManyToOne(() => User, (user: User) => user.pitches)
  updatedBy!: User;

  @IdField({ computed: true, nullable: true })
  declare updatedById: IDType;

  @StringField({ nullable: true })
  shortDescription!: string;

  // TODO: this should not filter by default, explicitly have to put filter: false here
  @StringField({ nullable: true, filter: false })
  presentationStatus!: string; // FK to PresentationStatus

  @IntField({ nullable: true })
  deckComfortLevel!: number;

  @IntField({ nullable: true })
  presentationComfortLevel!: number;

  @StringField({ nullable: true })
  challenges!: string;

  @OneToMany(() => PitchDeck, (pitchDeck: PitchDeck) => pitchDeck.pitch)
  pitchDecks!: PitchDeck[];

  @OneToMany(() => PitchVideo, (pitchVideo: PitchVideo) => pitchVideo.pitch)
  pitchVideos!: PitchVideo[];

  @OneToMany(() => PitchUserStatus, (status: PitchUserStatus) => status.pitch)
  pitchUserStatuses!: PitchUserStatus[];

  @OneToMany(() => PitchUpdate, (update: PitchUpdate) => update.pitch)
  updates!: PitchUpdate[];

  @OneToMany(() => PitchComment, (comment: PitchComment) => comment.pitch)
  comments!: PitchComment[];

  // Need to override defaults to get sorting, filtering, etc...
  @CreatedAtField({ sort: true })
  declare createdAt: Date;

  @UpdatedAtField({ sort: true })
  declare updatedAt: Date;

  @IdField({ filter: ['eq', 'in'], computed: true })
  declare ownerId: string;

  // Pitches _can_ be created from a course, but not always.  Allow us to drill back if there was a course that created this.
  @OneToOne(() => Course, (course: Course) => course.pitch, { nullable: true })
  course!: Course;

  /////////////////////////////////////////
  // Computed values
  /////////////////////////////////////////
  // This is populated via pitch.compute-female-minority.job.ts
  @BooleanField({ computed: true, filter: true, nullable: false, default: false })
  female!: number;

  // This is populated via pitch.compute-female-minority.job.ts
  @BooleanField({ computed: true, filter: true, nullable: false, default: false })
  minority!: number;

  // This is populated via pitch.compute-aggregates job
  @IntField({ computed: true, sort: true, nullable: false, default: 0 })
  views!: number;

  // This is populated via pitch.compute-aggregates job
  @IntField({ computed: true, sort: true, nullable: false, default: 0 })
  bookmarks!: number;

  /////////////////////////////////////////
  // API read only properties
  @StringField({ apiOnly: true, nullable: true, readonly: true })
  watchStatus?: string;

  @StringField({ apiOnly: true, filter: ['eq'], nullable: true })
  listStatus?: string;

  // Adding this so that we can reference it in the typings
  activePitchDeck?: PitchDeck;

  // Adding this so that we can reference it in the typings
  activePitchVideo?: PitchVideo;
}

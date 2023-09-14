// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Unique } from 'typeorm';
import {BaseModel, BooleanField, EnumField, IdField, IDType, ManyToOne, Model} from 'warthog'
import { User } from '../../identity/user/user.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchWatchStatus {
  UNWATCHED = 'UNWATCHED',
  WATCHED = 'WATCHED',
  UNWATCHED_MANUAL = 'UNWATCHED_MANUAL',
}

export enum PitchListStatus {
  DEFAULT = 'DEFAULT',
  BOOKMARK = 'BOOKMARK',
  IGNORE = 'IGNORE',
}

@Unique(['userId', 'pitchId'])
@Model()
export class PitchUserStatus extends BaseModel {
  @ManyToOne(() => User, (user: User) => user.pitchUserStatuses)
  user!: User;

  @IdField({ filter: ['eq'], editable: false, computed: true })
  userId!: IDType;

  @ManyToOne(() => Pitch, (pitch: Pitch) => pitch.pitchUserStatuses)
  pitch!: Pitch;

  @IdField({ filter: ['eq'], editable: false })
  pitchId!: IDType;

  @EnumField('PitchWatchStatus', PitchWatchStatus, { default: PitchWatchStatus.UNWATCHED })
  watchStatus!: PitchWatchStatus;

  @BooleanField({ filter: ['eq'], default: false })
  notified?: Boolean;

  @EnumField('PitchListStatus', PitchListStatus, { default: PitchListStatus.DEFAULT })
  listStatus!: PitchListStatus;
}

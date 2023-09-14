import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel, BooleanField, EnumField, IdField, IDType, Model, OneToOne } from 'warthog'
import { Video } from '../../core/video/video.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchVideoStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Model()
export class PitchVideo extends BaseModel {
  @EnumField('PitchVideoStatus', PitchVideoStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
  })
  status!: PitchVideoStatus;

  @BooleanField({ filter: ['eq'], default: false })
  extendedVideo?: boolean;

  @ManyToOne(() => Pitch, 'pitchVideos')
  pitch!: Pitch;

  @IdField()
  pitchId!: IDType;

  @OneToOne(() => Video, 'pitchVideo')
  @JoinColumn()
  video!: Video;

  @IdField({ computed: true })
  videoId!: IDType;
}

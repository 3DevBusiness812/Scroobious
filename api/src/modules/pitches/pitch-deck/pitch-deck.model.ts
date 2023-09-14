import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel, BooleanField, IntField, EnumField, IdField, IDType, Model, OneToOne } from 'warthog';
import { File } from '../../core/file/file.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchDeckStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Model()
export class PitchDeck extends BaseModel {
  @EnumField('PitchDeckStatus', PitchDeckStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
  })
  status!: PitchDeckStatus;

  // Set a pitch as "draft" so that it doesn't get turned "ACTIVE"
  @BooleanField({ filter: ['eq'], default: false })
  draft?: boolean;

  // migrated and manipulated via v2
  @BooleanField({ filter: ['eq'], default: false })
  isCategorized?: boolean;

  // migrated and manipulated via v2
  @IntField({ default: 0 })
  numPages!: number;

  @ManyToOne(() => Pitch, 'pitchDecks')
  pitch!: Pitch;

  @IdField()
  pitchId!: IDType;

  @OneToOne(() => File, 'pitchDeck')
  @JoinColumn()
  file!: File;

  @IdField({ computed: true })
  fileId!: IDType;
}

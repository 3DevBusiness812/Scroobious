// Pitch comments are comments made about the pitch by non-Scroobious users, i.e. investors
// This is different from "feedback," which is a paid feature
import { BaseModel, EnumField, IdField, IDType, ManyToOne, Model, StringField } from 'warthog';
import { User } from '../../identity/user/user.model';
import { Pitch } from '../pitch/pitch.model';

export enum PitchCommentVisibility {
  ANONYMOUS = 'ANONYMOUS',
  VISIBLE = 'VISIBLE',
}

@Model()
export class PitchComment extends BaseModel {
  @StringField()
  body!: string;

  @ManyToOne(() => Pitch, (pitch: Pitch) => pitch.comments)
  pitch?: Pitch;

  @IdField()
  pitchId!: IDType;

  @EnumField('PitchCommentVisibility', PitchCommentVisibility)
  visibility!: PitchCommentVisibility;

  @ManyToOne(() => User, (user: User) => user.pitchComments)
  createdBy?: User;

  @IdField({ computed: true })
  declare createdById: IDType;
}

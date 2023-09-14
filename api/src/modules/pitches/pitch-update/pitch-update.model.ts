// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { BaseModel, IdField, IDType, ManyToOne, Model, StringField } from 'warthog';
import { User } from '../../identity/user/user.model';
import { Pitch } from '../pitch/pitch.model';

@Model()
export class PitchUpdate extends BaseModel {
  @StringField()
  body!: string;

  @ManyToOne(() => Pitch, (pitch: Pitch) => pitch.updates)
  pitch?: Pitch;

  @IdField()
  pitchId!: IDType;

  @ManyToOne(() => User, (user: User) => user.pitchUpdates)
  createdBy?: User;

  @IdField({ computed: true })
  declare createdById: IDType;
}

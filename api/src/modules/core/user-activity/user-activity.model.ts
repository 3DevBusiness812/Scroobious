// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { BaseModel, IdField, IDType, ManyToOne, Model, StringField } from 'warthog';
import { User } from '../../identity/user/user.model';

@Model()
export class UserActivity extends BaseModel {
  @StringField()
  eventType!: string;

  @ManyToOne(() => User, (user: User) => user.pitches)
  createdBy!: User;

  @IdField({ computed: true })
  declare createdById: IDType;
}

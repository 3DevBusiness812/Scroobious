import { ManyToOne } from 'typeorm';
import { BaseModel, EnumField, Model, StringField } from 'warthog';
import { User } from '../../identity/user/user.model';

export enum ExternalSystemType {
  STRIPE = 'STRIPE',
}

@Model()
export class ExternalSystemId extends BaseModel {
  @StringField()
  externalSystemId!: string;

  @EnumField('ExternalSystemType', ExternalSystemType)
  externalSystemName!: ExternalSystemType;

  @ManyToOne(() => User, (user: User) => user.externalSystemIds)
  user?: User;
}

// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Matches } from 'class-validator';
import { ManyToOne } from 'typeorm';
import { BaseModel, BooleanField, IdField, IDType, Model, StringField } from 'warthog';
import { Role } from '../../access-management/role/role.model';

@Model()
export class UserType extends BaseModel {
  @Matches(/^[A-Z]+(_[A-Z]+)*$/) // Ex: FOO_BAR
  @StringField()
  type!: string;

  @ManyToOne(() => Role, 'userTypes')
  defaultRole!: Role;

  @IdField()
  defaultRoleId!: IDType;

  @BooleanField()
  allowedAtRegistration!: boolean;
}

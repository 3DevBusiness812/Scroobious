// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Matches } from 'class-validator';
import { OneToMany } from 'typeorm';
import { BaseModel, Model, StringField } from 'warthog';
import { RolePermission } from '../role-permission/role-permission.model';
import { UserRole } from '../user-role/user-role.model';

@Model()
export class Role extends BaseModel {
  @StringField({ filter: ['eq'] })
  name?: string;

  @Matches(/^[a-z\-]+$/)
  @StringField({ maxLength: 50, unique: true, filter: ['eq', 'in'] })
  code!: string;

  @OneToMany(() => UserRole, 'role')
  userRoles!: UserRole[];

  @OneToMany(() => RolePermission, 'role')
  rolePermissions!: RolePermission[];
}

// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Matches } from 'class-validator';
import { BaseModel, Model, OneToMany, StringField } from 'warthog';
import { RolePermission } from '../role-permission/role-permission.model';

@Model()
export class Permission extends BaseModel {
  // TODO: question - should we split up the code into "resource" and "action" so that
  // we can more easily group the permissions?
  @Matches(/^[a-z:_]+$/)
  @StringField({ maxLength: 50, unique: true, filter: ['in', 'eq'] })
  code!: string;

  @StringField({ maxLength: 100, nullable: true })
  description?: string;

  // @OneToMany(() => RolePermission, (rolePermission: RolePermission) => rolePermission.permission)
  @OneToMany(() => RolePermission, 'permission')
  rolePermissions!: RolePermission[];
}

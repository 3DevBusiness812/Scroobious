// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Unique } from 'typeorm';
import { BaseModel, IdField, IDType, ManyToOne, Model } from 'warthog';
import { Permission } from '../permission/permission.model';
import { Role } from '../role/role.model';

@Unique(['roleId', 'permissionId'])
@Model()
export class RolePermission extends BaseModel {
  // @ManyToOne(() => Permission, (permission: Permission) => permission.rolePermissions)
  @ManyToOne(() => Permission, 'rolePermissions')
  permission?: Permission;

  @IdField({ filter: ['eq'] })
  permissionId!: IDType;

  // @ManyToOne(() => Role, (role: Role) => role.rolePermissions)
  @ManyToOne(() => Role, 'rolePermissions')
  role?: Role;

  @IdField({ filter: ['eq'] })
  roleId!: IDType;
}

// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Unique } from 'typeorm';
import { BaseModel, IdField, IDType, ManyToOne, Model, StringField } from 'warthog';
// import { User } from '../../user/user.model';
import { Role } from '../role/role.model';

// This is a modified many-to-many table that also allows
// for additional metadata as a typical many-to-many is just
// a lightweight join table with the foreign keys
@Unique(['userId', 'roleId'])
@Model()
export class UserRole extends BaseModel {
  // TODO: need to enable this so we have foreign key constraints
  // @ManyToOne(
  //   () => User,
  //   (user: User) => user.userRoles
  // )
  // user?: User;

  @IdField({ filter: ['eq'] })
  userId!: IDType;

  @ManyToOne(() => Role, (role: Role) => role.userRoles)
  role?: Role;

  @IdField({ filter: ['eq'] })
  roleId!: IDType;

  // TODO: we should assign the user role to a particular account will need
  // account model (tree structure) and this will likely turn into ManyToOne
  @StringField({ nullable: true })
  organization?: string;
}

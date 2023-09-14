import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { Permission } from './permission.model';

@Service('PermissionService')
export class PermissionService extends BaseService<Permission> {
  constructor(@InjectRepository(Permission) protected readonly repository: Repository<Permission>) {
    super(Permission, repository);
  }

  async permissionsForUser(userId: string): Promise<string[]> {
    const query = `
      SELECT p.code
      FROM user_role ur
      INNER JOIN role r ON ur.role_id = r.id
      INNER JOIN role_permission rp ON ur.role_id = rp.role_id AND rp.deleted_at IS NULL
      INNER JOIN permission p ON rp.permission_id = p.id
      WHERE ur.user_id = $1;
    `;

    const permissions: { code: string }[] = await this.repository.query(query, [userId]);
    const codes = permissions.map((item) => item.code);

    return codes;

    // Note: I thought it would be good to give the system admin role all roles, so they could see
    // everything in the front end, but it turned out that was too noisy.  Keeping this here in case
    // that becomes helpful again, but for now we'll have to explicitly give the system admin
    // roles to be able to see things in the front end
    //
    // const isSystemAdmin = codes.indexOf('system:admin') > -1;
    // if (!isSystemAdmin) {
    // return codes;
    // }

    // System admins get all permissions
    // const allPermissions: { code: string }[] = await this.repository.find();
    // return allPermissions.map((item) => item.code);
  }
}

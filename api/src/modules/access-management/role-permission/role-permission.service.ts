import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
// import { BaseService } from 'warthog';
import { RolePermission } from './role-permission.model';

@Service('RolePermissionService')
export class RolePermissionService extends BaseService<RolePermission> {
  constructor(
    @InjectRepository(RolePermission) protected readonly repository: Repository<RolePermission>
  ) {
    super(RolePermission, repository);
  }
}

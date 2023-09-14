import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
// import { BaseService } from 'warthog';
import { UserRole } from './user-role.model';

@Service('UserRoleService')
export class UserRoleService extends BaseService<UserRole> {
  constructor(@InjectRepository(UserRole) protected readonly repository: Repository<UserRole>) {
    super(UserRole, repository);
  }

  async hardDelete(where: any, manager: EntityManager) {
    return manager.delete(UserRole, where);
  }
}

import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
// import { BaseService } from 'warthog';
import { Role } from './role.model';

@Service('RoleService')
export class RoleService extends BaseService<Role> {
  constructor(@InjectRepository(Role) protected readonly repository: Repository<Role>) {
    super(Role, repository);
  }
}

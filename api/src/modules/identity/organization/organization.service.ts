import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { Organization } from './organization.model';

@Service('OrganizationService')
export class OrganizationService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization) protected readonly repository: Repository<Organization>
  ) {
    super(Organization, repository);
  }
}

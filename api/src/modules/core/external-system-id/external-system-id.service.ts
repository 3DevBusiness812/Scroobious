import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';

import { ExternalSystemId } from './external-system-id.model';

@Service('ExternalSystemIdService')
export class ExternalSystemIdService extends BaseService<ExternalSystemId> {
  constructor(
    @InjectRepository(ExternalSystemId) protected readonly repository: Repository<ExternalSystemId>
  ) {
    super(ExternalSystemId, repository);
  }
}

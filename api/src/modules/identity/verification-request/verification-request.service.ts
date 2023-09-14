import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { VerificationRequest } from './verification-request.model';

@Service('VerificationRequestService')
export class VerificationRequestService extends BaseService<VerificationRequest> {
  constructor(
    @InjectRepository(VerificationRequest)
    protected readonly repository: Repository<VerificationRequest>
  ) {
    super(VerificationRequest, repository);
  }
}

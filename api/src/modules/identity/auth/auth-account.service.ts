import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { AuthAccount } from './auth-account.model';

@Service('AuthAccountService')
export class AuthAccountService extends BaseService<AuthAccount> {
  constructor(
    @InjectRepository(AuthAccount) protected readonly repository: Repository<AuthAccount>
  ) {
    super(AuthAccount, repository);
  }
}

import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { DeepPartial } from '../../../core';
import { UserService } from '../../identity/user/user.service';
import { InvestorProfile } from './investor-profile.model';

@Service('InvestorProfileService')
export class InvestorProfileService extends BaseService<InvestorProfile> {
  constructor(
    @InjectRepository(InvestorProfile) protected readonly repository: Repository<InvestorProfile>,
    @Inject('UserService') public readonly userService: UserService
  ) {
    super(InvestorProfile, repository);
  }

  @Transaction()
  async create(
    data: DeepPartial<InvestorProfile>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<InvestorProfile> {
    const createData = {
      ...data,
      userId, // enforce that the investor profile is attributed to logged in user
    };

    const investorProfile = await super.create(createData, userId, { manager });
    await this.userService.updateStatus(userId, 'CREATE_INVESTOR', userId, manager!); // Continue user onboarding process

    return investorProfile;
  }
}

import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { DeepPartial } from '../../../core';
import { UserService } from '../../identity/user/user.service';
import { FounderProfile } from './founder-profile.model';

@Service('FounderProfileService')
export class FounderProfileService extends BaseService<FounderProfile> {
  constructor(
    @InjectRepository(FounderProfile) protected readonly repository: Repository<FounderProfile>,
    @Inject('UserService') public readonly userService: UserService
  ) {
    super(FounderProfile, repository);
  }

  @Transaction()
  async create(
    data: DeepPartial<FounderProfile>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<FounderProfile> {
    const createData = {
      ...data,
      userId, // tie to the logged in user
    };

    const founderProfile = await super.create(createData, userId, { manager });
    await this.userService.updateStatus(userId, 'CREATE_FOUNDER_PROFILE', userId, manager); // Continue user onboarding process

    return founderProfile;
  }
}

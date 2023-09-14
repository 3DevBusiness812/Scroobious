import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService, DeepPartial, UpsertResult } from '../../../core';
import { PitchUserStatus } from './pitch-user-status.model';

@Service('PitchUserStatusService')
export class PitchUserStatusService extends BaseService<PitchUserStatus> {
  constructor(
    @InjectRepository(PitchUserStatus) protected readonly repository: Repository<PitchUserStatus>
  ) {
    super(PitchUserStatus, repository);
  }

  async findOneSafe<W>(where: W): Promise<PitchUserStatus | undefined> {
    try {
      // Return the single item if it exists
      const result = await super.findOne(where);
      return result;
    } catch (error) {
      // Otherwise, just return null
      return;
    }
  }

  async upsert(
    data: DeepPartial<PitchUserStatus>,
    where: any,
    userId: string
  ): Promise<UpsertResult<PitchUserStatus>> {
    const upsertData = {
      ...data,
      userId,
    };
    const upsertWhere = {
      ...where,
      userId_eq: userId,
    };

    return super.upsert(upsertData, upsertWhere, userId);
  }
}

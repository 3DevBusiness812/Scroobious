import { Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { BaseService } from '../../../core';
import { UserActivity } from './user-activity.model';

@Service('UserActivityService')
export class UserActivityService extends BaseService<UserActivity> {
  constructor(
    @InjectRepository(UserActivity) protected readonly repository: Repository<UserActivity>
  ) {
    super(UserActivity, repository);
  }

  async create(
    data: DeepPartial<UserActivity>,
    userId: string,
    options?: BaseOptions
  ): Promise<UserActivity> {
    const createData = {
      ...data,
      userId, // tie to the logged in user
    };

    return super.create(createData, userId, { manager: options?.manager });
  }
}

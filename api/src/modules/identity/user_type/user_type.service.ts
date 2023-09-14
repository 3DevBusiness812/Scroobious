import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core/base-service';
import { UserType } from './user_type.model';

@Service('UserTypeService')
export class UserTypeService extends BaseService<UserType> {
  constructor(@InjectRepository(UserType) protected readonly repository: Repository<UserType>) {
    super(UserType, repository);
  }

  // `type` examples ADMIN, INVESTOR, FOUNDER_FULL, REVIEWER
  async findByType(type: string) {
    const userTypeArray = await this.find({
      type_eq: type,
    });
    if (!userTypeArray || !userTypeArray.length) {
      throw new Error(`Unable to find user type ${type}`);
    }

    return userTypeArray[0];
  }
}

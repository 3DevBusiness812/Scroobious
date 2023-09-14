import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService } from 'warthog';
import { UserInvite, UserInviteStatus } from './user-invite.model';

@Service('UserInviteService')
export class UserInviteService extends BaseService<UserInvite> {
  constructor(@InjectRepository(UserInvite) protected readonly repository: Repository<UserInvite>) {
    super(UserInvite, repository);
  }

  async accept(email: string, type: string, userId: string, options?: BaseOptions) {
    let userInvite;
    try {
      userInvite = await this.findOne({ email, status: UserInviteStatus.OPEN });
    } catch (error) {
      throw new Error(`Unable to register as a ${type}: requires invite.`);
    }

    if (!(type === userInvite.userType)) {
      throw new Error(
        `Trying to register as a different user type than invited.  Invited as ${userInvite.userType}.  Registering as ${type}`
      );
    }

    return this.update(
      { status: UserInviteStatus.ACCEPTED },
      { id: userInvite.id },
      userId,
      options
    );
  }
}

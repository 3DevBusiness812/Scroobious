import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { UserService } from '../user/user.service';
import { Session } from './session.model';

@Service('SessionService')
export class SessionService extends BaseService<Session> {
  constructor(
    @InjectRepository(Session) protected readonly repository: Repository<Session>,
    @Inject('UserService') public readonly userService: UserService
  ) {
    super(Session, repository);
  }

  async findSession(where: any) {
    let session;
    try {
      session = await this.findOne<Session>(where);
    } catch (error) {
      return null;
    }

    const expires = session.expires as any;
    // console.log('session expires is a date?', expires instanceof Date);

    if (session && new Date(session.expires) < new Date()) {
      await this.delete(
        { where: { sessionToken: session.sessionToken } },
        this.userService.SYSTEM_USER_ID
      );
      return null;
    }

    return session;
  }
}

import { Inject, Service } from 'typedi';
import { DeepPartial, EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { OrganizationService } from '../../identity/organization/organization.service';
import { UserService } from '../../identity/user/user.service';
import { Startup } from './startup.model';

@Service('StartupService')
export class StartupService extends BaseService<Startup> {
  constructor(
    @InjectRepository(Startup) protected readonly repository: Repository<Startup>,
    @Inject('OrganizationService') public readonly organizationService: OrganizationService,
    @Inject('UserService') public readonly userService: UserService
  ) {
    super(Startup, repository);
  }

  @Transaction()
  async create(
    data: DeepPartial<Startup>,
    userId: string,
    @TransactionManager() manager?: EntityManager
  ): Promise<Startup> {
    const createData = {
      ...data,
      userId, // tie to the logged in user
    };

    // If organizationId is not passed in, create one
    let organization;
    if (!createData.organizationId) {
      organization = await this.organizationService.create(
        {
          name: createData.name,
          website: createData.website,
          userId,
        },
        userId,
        { manager }
      );

      createData.organizationId = organization.id;
    }

    const startup = await super.create(createData, userId, { manager });

    await this.userService.updateStatus(userId, 'CREATE_STARTUP', userId, manager); // Continue user onboarding process

    return startup;
  }
}

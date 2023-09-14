import { Container, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService, StandardDeleteResponse } from 'warthog';
import { DeepPartial } from '../../../core/types';
import { EventTypeService } from '../event-type/event-type.service';
import { Subscription } from './subscription.model';

@Service('SubscriptionService')
export class SubscriptionService extends BaseService<Subscription> {
  private eventTypeService: EventTypeService;

  constructor(
    @InjectRepository(Subscription) protected readonly repository: Repository<Subscription>
  ) {
    super(Subscription, repository);

    this.eventTypeService = Container.get('EventTypeService') as EventTypeService;
  }

  async create(data: DeepPartial<Subscription>, userId: string): Promise<Subscription> {
    const eventIsSubscribable = await this.eventTypeService.shouldPublish(data.eventTypeId);
    if (!eventIsSubscribable) {
      throw new Error(`Event subscription not valid for event type ${data.eventTypeId}`);
    }

    return super.create(data, userId);
  }

  async delete(where: any, userId: string, options?: BaseOptions): Promise<StandardDeleteResponse> {
    await this.manager.delete(this.entityClass, where);
    return { id: where.id };
  }
}

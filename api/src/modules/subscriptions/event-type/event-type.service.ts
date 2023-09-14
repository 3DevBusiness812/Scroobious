import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
// import { BaseService } from '../../../core';
import { BaseService } from 'warthog';
import { EventType } from './event-type.model';

@Service('EventTypeService')
export class EventTypeService extends BaseService<EventType> {
  constructor(@InjectRepository(EventType) protected readonly repository: Repository<EventType>) {
    super(EventType, repository);
  }

  // TODO: should we make sure that event types match table names? (at least before the period?  i.e. `conversation_message.create` - make sure conversation_message exists )

  // TODO: this should cache so that we're not querying event_types repeatedly
  async shouldPublish(eventType?: string): Promise<boolean> {
    if (eventType === undefined) {
      return false;
    }

    let eventTypeResource;
    try {
      eventTypeResource = await this.findOne({ name: eventType });
    } catch (error) {
      return false;
    }

    return !!eventTypeResource.allowSubscription;
  }
}

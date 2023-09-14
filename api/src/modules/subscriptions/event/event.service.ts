import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
// import { BaseService } from '../../../core';
import { BaseService } from 'warthog';
import { Event } from './event.model';

@Service('EventService')
export class EventService extends BaseService<Event> {
  constructor(@InjectRepository(Event) protected readonly repository: Repository<Event>) {
    super(Event, repository);
  }
}

import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { StripeWebhookEvent } from './stripe-webhook-event.model';

@Service('StripeWebhookEventService')
export class StripeWebhookEventService extends BaseService<StripeWebhookEvent> {
  constructor(
    @InjectRepository(StripeWebhookEvent)
    protected readonly repository: Repository<StripeWebhookEvent>
  ) {
    super(StripeWebhookEvent, repository);
  }
}

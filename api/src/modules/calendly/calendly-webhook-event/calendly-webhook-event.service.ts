import { BaseService } from '../../../core';
import { Service } from "typedi";
import { CalendlyWebhookEvent } from "./calendly-webhook-event.model";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

@Service('CalendlyWebhookEventService')
export class CalendlyWebhookEventService extends BaseService<CalendlyWebhookEvent> {
  constructor(
    @InjectRepository(CalendlyWebhookEvent)
    protected readonly repository: Repository<CalendlyWebhookEvent>
  ) {
    super(CalendlyWebhookEvent, repository);
  }
}
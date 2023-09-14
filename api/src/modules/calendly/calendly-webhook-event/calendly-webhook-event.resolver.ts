import { CalendlyWebhookEventCreateInput } from '../../../../generated';
import { Arg, Mutation, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { CalendlyWebhookEvent } from "./calendly-webhook-event.model";
import { CalendlyWebhookEventService } from "./calendly-webhook-event.service";

@Resolver(CalendlyWebhookEvent)
export class CalendlyWebhookEventResolver {
  constructor(
    @Inject('CalendlyWebhookEventService') public readonly service: CalendlyWebhookEventService
  ) { }

  @Mutation(() => CalendlyWebhookEvent)
  async createCalendlyWebhookEvent(
    @Arg('data') data: CalendlyWebhookEventCreateInput
  ): Promise<CalendlyWebhookEvent> {
    return this.service.create(data, '1');
  }
}
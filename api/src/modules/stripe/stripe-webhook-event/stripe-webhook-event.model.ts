import { BaseModel, EnumField, JSONField, JsonObject, Model, StringField } from 'warthog';

export enum StripeWebhookEventStatus {
  NEW = 'NEW',
  PROCESSED = 'PROCESSED',
  SKIPPED = 'SKIPPED',
}

@Model()
export class StripeWebhookEvent extends BaseModel {
  @EnumField('StripeWebhookEventStatus', StripeWebhookEventStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: StripeWebhookEventStatus.NEW,
  })
  status!: StripeWebhookEventStatus;

  @StringField()
  type!: string;

  @JSONField()
  raw!: JsonObject;
}

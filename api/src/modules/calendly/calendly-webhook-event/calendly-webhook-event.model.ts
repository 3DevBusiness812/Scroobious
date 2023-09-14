import { BaseModel, EnumField, JSONField, JsonObject, Model, StringField } from "warthog";

export enum CalendlyWebhookEventStatus {
  NEW = 'NEW',
  PROCESSED = 'PROCESSED',
  SKIPPED = 'SKIPPED',
}

@Model()
export class CalendlyWebhookEvent extends BaseModel {
  @EnumField('CalendlyWebhookEventStatus', CalendlyWebhookEventStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: CalendlyWebhookEventStatus.NEW,
  })
  status!: CalendlyWebhookEventStatus;

  @StringField()
  type!: string;

  @JSONField()
  raw!: JsonObject;
}
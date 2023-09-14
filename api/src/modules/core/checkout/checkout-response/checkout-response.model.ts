import { BaseModel, Model, StringField } from 'warthog';

@Model()
export class CheckoutResponse extends BaseModel {
  @StringField()
  stripeSessionId!: string;
}

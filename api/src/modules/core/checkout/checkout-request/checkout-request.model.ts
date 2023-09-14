import { BaseModel, Model, StringField } from 'warthog';

@Model()
export class CheckoutRequest extends BaseModel {
  @StringField()
  stripePlanId!: string;

  @StringField({ writeonly: true, apiOnly: true })
  successUrl!: string;

  @StringField({ writeonly: true, apiOnly: true })
  cancelUrl!: string;
}

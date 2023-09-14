import { BaseModel, EnumField, FloatField, ManyToOne, Model, StringField } from 'warthog';
import { User } from '../identity/user/user.model';

export enum PaymentStatus {
  SUCCEEDED = 'SUCCEEDED',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD',
  PROCESSING = 'PROCESSING',
  AMOUNT_CAPTURABLE_UPDATED = 'AMOUNT_CAPTURABLE_UPDATED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

@Model()
export class Plan extends BaseModel {
  @StringField()
  stripePlanId!: string;

  @StringField()
  stripePlanName!: string;

  @StringField()
  stripePlanDescription!: string;

  @StringField()
  stripePlanCurrency!: string;

  @FloatField()
  stripePlanPrice!: number;

  @StringField()
  stripePlanPeriod!: string;

  @StringField()
  stripePlanSubscriptionId?: string;

  @EnumField('PaymentStatus', PaymentStatus, {
    filter: ['eq'],
    nullable: true,
  })
  status!: PaymentStatus;
  stripePaymentStatus?: string;

  @ManyToOne(() => User, 'Plan')
  user!: User;
}

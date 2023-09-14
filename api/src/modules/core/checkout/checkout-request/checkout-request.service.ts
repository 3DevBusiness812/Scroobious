import Stripe from 'stripe';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { CheckoutRequestCreateInput } from '../../../../../generated';
import { ConfigService } from '../../../../core';
import { CheckoutRequest } from './checkout-request.model';
import { CheckoutRequestCreateResponse } from './checkout-request.resolver';

@Service('CheckoutRequestService')
export class CheckoutRequestService extends BaseService<CheckoutRequest> {
  stripe: any;
  constructor(
    @InjectRepository(CheckoutRequest) protected readonly repository: Repository<CheckoutRequest>,
    @Inject('ConfigService') public readonly config: ConfigService
  ) {
    super(CheckoutRequest, repository);
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }
  async getCheckoutRequest({
    stripePlanId,
    successUrl,
    cancelUrl,
  }: CheckoutRequestCreateInput): Promise<CheckoutRequestCreateResponse> {
    if (!(stripePlanId && successUrl && cancelUrl)) {
      throw new Error('Missing required fields');
    }
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePlanId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}/?canceled=true`,
    });
    return Promise.resolve({ sessionUrl: session.url });
  }
}

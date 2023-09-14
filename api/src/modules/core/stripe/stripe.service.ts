import Stripe from 'stripe';
import { Inject, Service } from 'typedi';
import { ConfigService } from '../../../core';

@Service('StripeService')
export class StripeService {
  testMode: boolean;
  stripe: any; // Stripe;

  constructor(@Inject('ConfigService') public readonly config: ConfigService) {
    this.testMode = process.env.NODE_ENV === 'test';

    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  async getManageSubscriptionUrl(customerId: string) {
    const { url } = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/account-settings`,
    });

    return url;
  }

  async getInfoFromSession(stripeSessionId: string) {
    // NOTE: this is an anti-pattern.  I'm mocking this service out for tests by checking
    // to see if we're in test mode here.  We should actually use dependency injection in the
    // tests, but... time.
    if (this.testMode) {
      return {
        //
      };
    }

    /////////////////////////
    // Start non-test code
    const session = await this.stripe.checkout.sessions.retrieve(stripeSessionId);
    const subscription = await this.stripe.subscriptions.retrieve(session.subscription);
    const customer = await this.stripe.customers.retrieve(subscription.customer);
    const product = await this.stripe.products.retrieve(subscription.plan.product);

    return {
      session,
      subscription,
      customer,
      product,
      planId: subscription.plan.id,
      email: customer.email,
      fullName: customer.name,
      userType: product.metadata.user_type,
    };
  }
}

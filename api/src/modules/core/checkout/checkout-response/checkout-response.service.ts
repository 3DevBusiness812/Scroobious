import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { CheckoutResponseCreateInput } from '../../../../../generated';
import { UserPlanRegistrationService } from '../../../identity/user-plan-registration/user-plan-registration.service';
import { StripeService } from '../../stripe/stripe.service';
import { CheckoutResponse } from './checkout-response.model';
import { CheckoutResponseCreateResponse } from './checkout-response.resolver';

@Service('CheckoutResponseService')
export class CheckoutResponseService extends BaseService<CheckoutResponse> {
  stripe: any;
  constructor(
    @InjectRepository(CheckoutResponse) protected readonly repository: Repository<CheckoutResponse>,
    @Inject('UserPlanRegistrationService')
    public readonly userPlanRegistrationService: UserPlanRegistrationService,
    @Inject('StripeService') public readonly stripeService: StripeService
  ) {
    super(CheckoutResponse, repository);
  }

  async createCheckoutResponse(
    { stripeSessionId }: CheckoutResponseCreateInput,
    userId: string
  ): Promise<CheckoutResponseCreateResponse> {
    const { customer, session, planId, userType, subscription, product, fullName } =
      await this.stripeService.getInfoFromSession(stripeSessionId);

    // console.log('customer :>> ', customer);
    // console.log('session :>> ', session);
    // console.log('subscription :>> ', subscription);
    // console.log('product :>> ', product);
    // console.log('userType :>> ', userType);
    // console.log('planId :>> ', planId);
    // console.log('fullName :>> ', fullName);

    // console.log('product.metadata.role_code :>> ', product.metadata.role_code);

    await this.userPlanRegistrationService.create(
      {
        email: customer.email,
        fullName,
        stripeSubscriptionId: session.subscription,
        stripePlanId: planId,
        userType,
        raw: subscription,
        userId,
      },
      userId
    );

    return Promise.resolve({
      stripeSubscriptionId: session.subscription,
      stripeCustomerId: subscription.customer,
      stripeCustomerName: fullName,
      stripeCustomerEmail: customer.email,
      stripePlanId: planId,
      stripePlanName: product.name,
      appliesTo: product.metadata.applies_to,
      userType,
    });
  }
}

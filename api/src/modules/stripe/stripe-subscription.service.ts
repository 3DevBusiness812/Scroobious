import { Inject, Service } from 'typedi';
import { StripeService } from '../core/stripe/stripe.service';
import { UserService } from '../identity/user/user.service';
import { ManageStripeSubscriptionResponse } from './stripe-subscription.resolver';

@Service('StripeSubscriptionService')
export class StripeSubscriptionService {
  constructor(
    @Inject('UserService') public readonly userService: UserService,
    @Inject('StripeService') public readonly stripeService: StripeService
  ) {
    //
  }

  async manage(userId: string): Promise<ManageStripeSubscriptionResponse> {
    const me = this.userService.findOne({ id: userId });
    // query me {
    //   me {
    //     id
    //     stripeUserId
    //   }
    // }
    // console.log('result :>> ', result)
    const customerId = (await me).stripeUserId;
    console.log('customerId :>> ', customerId);

    let url = '';
    if (customerId) {
      url = await this.stripeService.getManageSubscriptionUrl(customerId);
    }

    return { url };
  }
}

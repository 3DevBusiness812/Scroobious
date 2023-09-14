import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { CheckoutResponseCreateInput } from '../../../../../generated';
import { ConfigService } from '../../../../core/config.service';
import { UserService } from '../../../identity/user/user.service';
import { CheckoutResponse } from './checkout-response.model';
import { CheckoutResponseService } from './checkout-response.service';

@ObjectType()
export class CheckoutResponseCreateResponse {
  @Field({ nullable: true })
  stripeCustomerId!: string;

  @Field({ nullable: true })
  stripeSubscriptionId!: string;

  @Field({ nullable: true })
  stripeCustomerName!: string;

  @Field({ nullable: true })
  stripeCustomerEmail!: string;

  @Field({ nullable: true })
  stripePlanId!: string;

  @Field({ nullable: true })
  stripePlanName!: string;

  @Field({ nullable: true })
  appliesTo!: string;
}

@Resolver(CheckoutResponse)
export class CheckoutResponseResolver {
  constructor(
    @Inject('CheckoutResponseService') public readonly service: CheckoutResponseService,
    @Inject('ConfigService') public readonly config: ConfigService,
    @Inject('UserService') public readonly userService: UserService
  ) {}

  @Mutation(() => CheckoutResponseCreateResponse)
  async createCheckoutResponse(
    @Arg('data') data: CheckoutResponseCreateInput
  ): Promise<CheckoutResponseCreateResponse> {
    return await this.service.createCheckoutResponse(data, this.userService.SYSTEM_USER_ID);
  }
}

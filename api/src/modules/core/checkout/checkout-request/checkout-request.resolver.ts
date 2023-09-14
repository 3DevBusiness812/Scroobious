import { Arg, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { CheckoutRequestCreateInput } from '../../../../../generated';
import { CheckoutRequest } from './checkout-request.model';
import { CheckoutRequestService } from './checkout-request.service';

@ObjectType()
export class CheckoutRequestCreateResponse {
  @Field({ nullable: false })
  sessionUrl!: string;
}
@Resolver(CheckoutRequest)
export class CheckoutRequestResolver {
  constructor(@Inject('CheckoutRequestService') public readonly service: CheckoutRequestService) {}

  @Mutation(() => CheckoutRequestCreateResponse)
  async createCheckoutRequest(
    @Arg('data') data: CheckoutRequestCreateInput
  ): Promise<CheckoutRequestCreateResponse> {
    return await this.service.getCheckoutRequest(data);
  }
}

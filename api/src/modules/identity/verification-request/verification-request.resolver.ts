import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  VerificationRequestCreateInput,
  VerificationRequestWhereArgs,
  VerificationRequestWhereUniqueInput,
} from '../../../../generated';
import { VerificationRequest } from './verification-request.model';
import { VerificationRequestService } from './verification-request.service';

@Resolver(VerificationRequest)
export class VerificationRequestResolver {
  constructor(
    @Inject('VerificationRequestService') public readonly service: VerificationRequestService
  ) {}

  @Query(() => [VerificationRequest])
  async verificationRequests(
    @Args() { where, orderBy, limit, offset }: VerificationRequestWhereArgs,
    @Fields() fields: string[]
  ): Promise<VerificationRequest[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // Needed by NextAuth
  @Query(() => VerificationRequest)
  async verificationRequest(
    @Arg('where') where: VerificationRequestWhereUniqueInput
  ): Promise<VerificationRequest> {
    return this.service.findOne<VerificationRequestWhereUniqueInput>(where);
  }

  // Needed by NextAuth
  @Mutation(() => VerificationRequest)
  async createVerificationRequest(
    @Arg('data') data: VerificationRequestCreateInput,
    @UserId() userId: string
  ): Promise<VerificationRequest> {
    return this.service.create(data, userId);
  }

  // Needed by NextAuth
  @Mutation(() => StandardDeleteResponse)
  async deleteVerificationRequest(
    @Arg('where') where: VerificationRequestWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

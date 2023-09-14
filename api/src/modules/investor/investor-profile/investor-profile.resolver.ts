import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { UserId } from 'warthog';
import {
  InvestorProfileCreateInput,
  InvestorProfileWhereUniqueInput,
  InvestorProfileUpdateArgs,
} from '../../../../generated';
import { InvestorProfile } from './investor-profile.model';
import { InvestorProfileService } from './investor-profile.service';

// TODO: add startup_profile directly to pitch

@Resolver(InvestorProfile)
export class InvestorProfileResolver {
  constructor(@Inject('InvestorProfileService') public readonly service: InvestorProfileService) {}

  // // TODO: @RequirePermission('pitch:admin')
  // @FieldResolver(() => UserSafe)
  // createdBy(@Root() pitchUpdate: InvestorProfile, @Ctx() ctx: BaseContext): Promise<UserSafe> {
  //   return ctx.dataLoader.loaders.InvestorProfile.createdBy.load(pitchUpdate);
  // }

  // TODO:   @RequirePermission('pitch:admin')
  @Query(() => InvestorProfile)
  async investorProfile(
    @Arg('where') where: InvestorProfileWhereUniqueInput
  ): Promise<InvestorProfile> {
    return this.service.findOne<InvestorProfileWhereUniqueInput>(where);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => InvestorProfile)
  async createInvestorProfile(
    @Arg('data') data: InvestorProfileCreateInput,
    @UserId() userId: string
  ): Promise<InvestorProfile> {
    return this.service.create(data, userId);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => InvestorProfile)
  async updateInvestorProfile(
    @Args() { data, where }: InvestorProfileUpdateArgs,
    @UserId() userId: string
  ): Promise<InvestorProfile> {
    return this.service.update(data, where, userId);
  }
}

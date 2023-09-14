import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { PlanCreateInput } from '../../../generated';
import { UserService } from '../identity/user/user.service';
import { Plan } from './plan.model';
import { PlanService } from './plan.service';

@Resolver(Plan)
export class PlanResolver {
  constructor(
    @Inject('PlanService') public readonly service: PlanService,
    @Inject('UserService') public readonly userService: UserService
  ) {}

  @Mutation(() => Plan)
  async createPlan(@Arg('data') data: PlanCreateInput): Promise<Plan> {
    return this.service.create(data, this.userService.SYSTEM_USER_ID);
  }
}

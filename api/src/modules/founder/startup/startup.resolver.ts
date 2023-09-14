import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Inject } from 'typedi';
import { BaseContext, UserId } from 'warthog';
import { StartupCreateInput, StartupUpdateArgs, StartupWhereUniqueInput } from '../../../../generated'
import { Organization } from '../../identity/organization/organization.model';
import { Startup } from './startup.model';
import { StartupService } from './startup.service';

@Resolver(Startup)
export class StartupResolver {
  constructor(@Inject('StartupService') public readonly service: StartupService) {}

  // @Permission(['startup:list'])
  @Query(() => Startup)
  async startup(@Arg('where') where: StartupWhereUniqueInput): Promise<Startup> {
    return this.service.findOne<StartupWhereUniqueInput>(where);
  }

  @FieldResolver(() => Organization)
  organization(@Root() startup: Startup, @Ctx() ctx: BaseContext): Promise<Organization> {
    return ctx.dataLoader.loaders.Startup.organization.load(startup);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => Startup)
  async createStartup(
    @Arg('data') data: StartupCreateInput,
    @UserId() userId: string
  ): Promise<Startup> {
    return this.service.create(data, userId);
  }

  // TODO: @RequirePermission('pitch:admin')
  @Mutation(() => Startup)
  async updateStartup(
      @Args() { data, where }: StartupUpdateArgs,
      @UserId() userId: string
  ): Promise<Startup> {
    return this.service.update(data, where, userId);
  }}

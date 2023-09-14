import DataLoader from 'dataloader';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  OrganizationCreateInput,
  OrganizationUpdateArgs,
  OrganizationWhereArgs,
  OrganizationWhereUniqueInput,
} from '../../../../generated';
import { Startup } from '../../founder/startup/startup.model';
import { StartupService } from '../../founder/startup/startup.service';
import { Organization } from '../../identity/organization/organization.model';
import { OrganizationService } from '../../identity/organization/organization.service';
import { User } from '../../identity/user/user.model';

@Resolver(Organization)
export class OrganizationResolver {
  startupLoader: DataLoader<Organization, Startup>;

  constructor(
    @Inject('OrganizationService') public readonly service: OrganizationService,
    @Inject('StartupService') public readonly startupService: StartupService
  ) {
    this.startupLoader = new DataLoader(async (organizations) => {
      const startups = await startupService.find({
        organizationId_in: organizations.map((organization) => organization.id),
      });

      // console.log('startups :>> ', startups);

      return organizations.map((organization) => {
        return startups.find((startup) => {
          return startup.organizationId === organization.id;
        })!;
      });
    });
  }

  // TODO: @RequirePermission('pitch:admin')
  @FieldResolver(() => Startup)
  startup(@Root() organization: Organization, @Ctx() ctx: BaseContext): Promise<Startup> {
    return this.startupLoader.load(organization);
  }

  // @RequirePermission('role:admin')
  @FieldResolver(() => User)
  user(@Root() organization: Organization, @Ctx() ctx: BaseContext): Promise<User> {
    return ctx.dataLoader.loaders.Organization.user.load(organization);
  }

  @Query(() => [Organization])
  async organizations(
    @Args() { where, orderBy, limit, offset }: OrganizationWhereArgs,
    @Fields() fields: string[]
  ): Promise<Organization[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Query(() => Organization)
  async organization(@Arg('where') where: OrganizationWhereUniqueInput): Promise<Organization> {
    return this.service.findOne<OrganizationWhereUniqueInput>(where);
  }

  @Mutation(() => Organization)
  async createOrganization(
    @Arg('data') data: OrganizationCreateInput,
    @UserId() userId: string
  ): Promise<Organization> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Organization)
  async updateOrganization(
    @Args() { data, where }: OrganizationUpdateArgs,
    @UserId() userId: string
  ): Promise<Organization> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteOrganization(
    @Arg('where') where: OrganizationWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

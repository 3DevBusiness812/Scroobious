import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, UserId } from 'warthog';
import {
  SuggestedResourceCreateInput,
  SuggestedResourceUpdateArgs,
  SuggestedResourceWhereArgs,
  SuggestedResourceWhereUniqueInput,
} from '../../../../generated';
import { Permission } from '../../../core';
import { FileService } from '../../core/file/file.service';
import { SuggestedResourceCategory } from '../suggested-resource-category/suggested-resource-category.model';
import { SuggestedResource } from './suggested-resource.model';
import { SuggestedResourceService } from './suggested-resource.service';

@Resolver(SuggestedResource)
export class SuggestedResourceResolver {
  constructor(
    @Inject('SuggestedResourceService') public readonly service: SuggestedResourceService,
    @Inject('FileService') public readonly fileService: FileService
  ) {}

  @FieldResolver(() => SuggestedResourceCategory)
  suggestedResourceCategory(
    @Root() suggestedResource: SuggestedResource,
    @Ctx() ctx: BaseContext
  ): Promise<SuggestedResourceCategory> {
    return ctx.dataLoader.loaders.SuggestedResource.suggestedResourceCategory.load(
      suggestedResource
    );
  }

  @FieldResolver(() => File)
  logoFile(@Root() suggestedResource: SuggestedResource, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.SuggestedResource.logoFile.load(suggestedResource);
  }

  @Permission('suggested_resource:list')
  @Query(() => [SuggestedResource])
  async suggestedResources(
    @Args() { where, orderBy, limit, offset }: SuggestedResourceWhereArgs,
    @Fields() fields: string[]
  ): Promise<SuggestedResource[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('suggested_resource:list')
  @Query(() => SuggestedResource)
  async suggestedResource(
    @Arg('where') where: SuggestedResourceWhereUniqueInput
  ): Promise<SuggestedResource> {
    return this.service.findOne<SuggestedResourceWhereUniqueInput>(where);
  }

  @Permission('suggested_resource:create')
  @Mutation(() => SuggestedResource)
  async createSuggestedResource(
    @Arg('data') data: SuggestedResourceCreateInput,
    @UserId() userId: string
  ): Promise<SuggestedResource> {
    return this.service.create(data, userId);
  }

  // We'll reuse suggestedResource:create here. Can separate later if we want
  @Permission('suggested_resource:create')
  @Mutation(() => SuggestedResource)
  async updateSuggestedResource(
    @Args() { data, where }: SuggestedResourceUpdateArgs,
    @UserId() userId: string
  ): Promise<SuggestedResource> {
    return this.service.update(data, where, userId);
  }
}

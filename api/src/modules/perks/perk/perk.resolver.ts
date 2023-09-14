import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, UserId } from 'warthog';
import {
  PerkCreateInput,
  PerkUpdateArgs,
  PerkUpdateInput,
  PerkWhereArgs,
  PerkWhereUniqueInput,
} from '../../../../generated';
import { Permission } from '../../../core';
import { FileService } from '../../core/file/file.service';
import { PerkCategory } from '../perk-category/perk-category.model';
import { Perk } from './perk.model';
import { PerkService } from './perk.service';

@Resolver(Perk)
export class PerkResolver {
  constructor(
    @Inject('PerkService') public readonly service: PerkService,
    @Inject('FileService') public readonly fileService: FileService
  ) {}

  @FieldResolver(() => PerkCategory)
  perkCategory(@Root() perk: Perk, @Ctx() ctx: BaseContext): Promise<PerkCategory> {
    return ctx.dataLoader.loaders.Perk.perkCategory.load(perk);
  }

  @FieldResolver(() => File)
  logoFile(@Root() perk: Perk, @Ctx() ctx: BaseContext): Promise<File> {
    return ctx.dataLoader.loaders.Perk.logoFile.load(perk);
  }

  @Permission('perk:list')
  @Query(() => [Perk])
  async perks(
    @Args() { where, orderBy, limit, offset }: PerkWhereArgs,
    @Fields() fields: string[]
  ): Promise<Perk[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Permission('perk:list')
  @Query(() => Perk)
  async perk(@Arg('where') where: PerkWhereUniqueInput): Promise<Perk> {
    return this.service.findOne<PerkWhereUniqueInput>(where);
  }

  @Permission('perk:create')
  @Mutation(() => Perk)
  async createPerk(@Arg('data') data: PerkCreateInput, @UserId() userId: string): Promise<Perk> {
    return this.service.create(data, userId);
  }

  // We'll reuse perk:create here. Can separate later if we want
  @Permission('perk:create')
  @Mutation(() => Perk)
  async updatePerk(
    @Args() { data, where }: PerkUpdateArgs,
    @UserId() userId: string
  ): Promise<Perk> {
    return this.service.update<PerkUpdateInput, PerkWhereUniqueInput>(data, where, userId);
  }
}

import { Arg, Args, Query, Resolver, Ctx, FieldResolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, BaseContext } from 'warthog';
import {
  CityWhereArgs,
  CityWhereUniqueInput,
} from '../../../../generated';
import { StateProvince } from '../state-province.model';
import { City } from './city.model';
import { CityService } from './city.service';

@Resolver(City)
export class CityResolver {
  constructor(@Inject('CityService') public readonly cityService: CityService) {}

  @FieldResolver(() => StateProvince)
  stateProvince(@Root() city: City, @Ctx() ctx: BaseContext): Promise<StateProvince> {
    return ctx.dataLoader.loaders.City.stateProvince.load(city);
  }

  @Query(() => [City])
  async cities(
    @Args() { where, orderBy, limit, offset }: CityWhereArgs,
    @Fields() fields: string[],
  ): Promise<City[]> {
    return this.cityService.query(where, orderBy, limit, offset, fields);
  }

  @Query(() => City, { nullable: true })
  async city(@Arg('where') where: CityWhereUniqueInput): Promise<City | null> {
    return this.cityService.findCity(where)
  }
}

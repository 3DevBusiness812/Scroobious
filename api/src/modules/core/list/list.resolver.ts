import { Arg, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { List, ListService, ListWhereInput } from './list.service';

@Resolver(List)
export class ListResolver {
  constructor(@Inject('ListService') public readonly service: ListService) {}

  // TODO: @Permission('list_item:admin')
  @Query(() => [List])
  async lists(@Arg('where') where: ListWhereInput): Promise<List[]> {
    return this.service.find(where);
    // const lists = await this.service.find(where, userId);
    // console.log('lists (from resolver) :>> ', JSON.stringify(lists, undefined, 2));
    // return JSON.parse(JSON.stringify(lists, undefined, 2));
  }
}

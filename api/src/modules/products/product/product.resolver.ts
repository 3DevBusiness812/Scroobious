import { Args, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields } from 'warthog';
import { ProductWhereArgs } from '../../../../generated';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Resolver(Product)
export class ProductResolver {
  constructor(@Inject('ProductService') public readonly productService: ProductService) {}

  // TODO: Lock this down
  @Query(() => [Product])
  async products(
    @Args() { where, orderBy, limit, offset }: ProductWhereArgs,
    @Fields() fields: string[]
  ): Promise<Product[]> {
    return this.productService.find(where, orderBy, limit, offset, fields);
  }
}

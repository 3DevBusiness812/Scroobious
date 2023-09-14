import { Args, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields } from 'warthog';
import { CourseDefinitionProductWhereArgs } from '../../../../generated';
import { CourseDefinitionProduct } from './course-definition-product.model';
import { CourseDefinitionProductService } from './course-definition-product.service';

@Resolver(CourseDefinitionProduct)
export class CourseDefinitionProductResolver {
  constructor(
    @Inject('CourseDefinitionProductService')
    public readonly service: CourseDefinitionProductService
  ) {}

  @Query(() => [CourseDefinitionProduct])
  async courseDefinitionProducts(
    @Args() { where, orderBy, limit, offset }: CourseDefinitionProductWhereArgs,
    @Fields() fields: string[]
  ): Promise<CourseDefinitionProduct[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }
}

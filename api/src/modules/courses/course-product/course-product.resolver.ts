const { GraphQLJSONObject } = require('graphql-type-json');
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, JsonObject, UserId } from 'warthog';
import {
  CourseProductCreateInput,
  CourseProductWhereArgs,
  CourseProductWhereUniqueInput,
  CourseProductUpdateArgs,
} from '../../../../generated'
import { Product } from '../../products/product/product.model';
import { Course } from '../course/course.model';
import { CourseProduct, CourseProductStatus } from './course-product.model';
import { CourseProductService } from './course-product.service';

@ArgsType()
export class CourseProductTransitionArgs {
  @Field(() => CourseProductStatus) status!: CourseProductStatus;
  @Field(() => GraphQLJSONObject, { nullable: true }) data!: JsonObject;
  @Field() where!: CourseProductWhereUniqueInput;
}

@Resolver(CourseProduct)
export class CourseProductResolver {
  constructor(@Inject('CourseProductService') public readonly service: CourseProductService) {}

  @FieldResolver(() => [Course])
  course(@Root() courseProduct: CourseProduct, @Ctx() ctx: BaseContext): Promise<Course[]> {
    return ctx.dataLoader.loaders.CourseProduct.course.load(courseProduct);
  }

  @FieldResolver(() => [Product])
  product(@Root() courseProduct: CourseProduct, @Ctx() ctx: BaseContext): Promise<Product[]> {
    return ctx.dataLoader.loaders.CourseProduct.product.load(courseProduct);
  }

  @Mutation(() => CourseProduct)
  async createCourseProduct(
    @Arg('data') data: CourseProductCreateInput,
    @UserId() userId: string
  ): Promise<CourseProduct> {
    return this.service.createCourse(data, userId);
  }

  @Mutation(() => CourseProduct)
  async updateCourseProduct(
    @Args() { data, where }: CourseProductUpdateArgs,
    @UserId() userId: string
  ): Promise<CourseProduct> {
    return this.service.update(data, where, userId);
  }

  @Query(() => [CourseProduct])
  async courseProducts(
    @Args() { where, orderBy, limit, offset }: CourseProductWhereArgs,
    @Fields() fields: string[]
  ): Promise<CourseProduct[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }
}

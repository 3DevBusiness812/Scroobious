import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  CourseCreateInput,
  CourseUpdateArgs,
  CourseWhereArgs,
  CourseWhereUniqueInput,
} from '../../../../generated';
import { Pitch } from '../../pitches/pitch/pitch.model';
import { CourseDefinition } from '../course-definition/course-definition.model';
import { CourseProduct } from '../course-product/course-product.model';
import { CourseStep } from '../course-step/course-step.model';
import { Course } from './course.model';
import { CourseService } from './course.service';

@Resolver(Course)
export class CourseResolver {
  constructor(@Inject('CourseService') public readonly service: CourseService) {}

  // TODO: @Permission('founder')
  @FieldResolver(() => CourseDefinition)
  courseDefinition(@Root() course: Course, @Ctx() ctx: BaseContext): Promise<CourseDefinition> {
    return ctx.dataLoader.loaders.Course.courseDefinition.load(course);
  }

  // TODO: @Permission('founder')
  @FieldResolver(() => [CourseStep])
  courseSteps(@Root() course: Course, @Ctx() ctx: BaseContext): Promise<CourseStep[]> {
    return ctx.dataLoader.loaders.Course.courseSteps.load(course);
  }

  // TODO: @Permission('founder')
  @FieldResolver(() => [CourseProduct])
  courseProducts(@Root() course: Course, @Ctx() ctx: BaseContext): Promise<CourseProduct[]> {
    return ctx.dataLoader.loaders.Course.courseProducts.load(course);
  }

  @FieldResolver(() => Pitch)
  pitch(@Root() course: Course, @Ctx() ctx: BaseContext): Promise<Pitch> {
    return ctx.dataLoader.loaders.Course.pitch.load(course);
  }

  @Query(() => [Course])
  async courses(
    @Args() { where, orderBy, limit, offset }: CourseWhereArgs,
    @UserId() userId: string,
    @Fields() fields: string[]
  ): Promise<Course[]> {
    return this.service.query(where, userId, orderBy, limit, offset, fields);
  }

  @Query(() => Course)
  async course(@Arg('where') where: CourseWhereUniqueInput): Promise<Course> {
    return this.service.findOne<CourseWhereUniqueInput>(where);
  }

  @Mutation(() => Course)
  async createCourse(
    @Arg('data') data: CourseCreateInput,
    @UserId() userId: string
  ): Promise<Course> {
    return this.service.create(data, userId);
  }

  @Mutation(() => Course)
  async completeCourse(
    @Arg('where') where: CourseWhereUniqueInput,
    @UserId() userId: string
  ): Promise<Course> {
    return this.service.complete(where, userId);
  }

  @Mutation(() => Course)
  async updateCourse(
    @Args() { data, where }: CourseUpdateArgs,
    @UserId() userId: string
  ): Promise<Course> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteCourse(
    @Arg('where') where: CourseWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

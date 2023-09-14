import { Args, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields } from 'warthog';
import { CourseDefinitionWhereArgs } from '../../../../generated';
import { CourseStepDefinition } from '../course-step-definition/course-step-definition.model';
import { CourseDefinition } from './course-definition.model';
import { CourseDefinitionService } from './course-definition.service';

@Resolver(CourseDefinition)
export class CourseDefinitionResolver {
  constructor(
    @Inject('CourseDefinitionService') public readonly service: CourseDefinitionService
  ) {}

  // TODO: @Permission('founder')
  @FieldResolver(() => [CourseStepDefinition])
  courseStepDefinitions(
    @Root() courseDefinition: CourseDefinition,
    @Ctx() ctx: BaseContext
  ): Promise<CourseStepDefinition[]> {
    return ctx.dataLoader.loaders.CourseDefinition.courseStepDefinitions.load(courseDefinition);
  }

  @Query(() => [CourseDefinition])
  async courseDefinitions(
    @Args() { where, orderBy, limit, offset }: CourseDefinitionWhereArgs,
    @Fields() fields: string[]
  ): Promise<CourseDefinition[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  // @Permission('system:admin')
  // @Query(() => CourseDefinition)
  // async courseDefinition(
  //   @Arg('where') where: CourseDefinitionWhereUniqueInput
  // ): Promise<CourseDefinition> {
  //   return this.service.findOne<CourseDefinitionWhereUniqueInput>(where);
  // }

  // @Permission('system:admin')
  // @Mutation(() => CourseDefinition)
  // async createCourseDefinition(
  //   @Arg('data') data: CourseDefinitionCreateInput,
  //   @UserId() userId: string
  // ): Promise<CourseDefinition> {
  //   return this.service.create(data, userId);
  // }

  // @Permission('system:admin')
  // @Mutation(() => CourseDefinition)
  // async updateCourseDefinition(
  //   @Args() { data, where }: CourseDefinitionUpdateArgs,
  //   @UserId() userId: string
  // ): Promise<CourseDefinition> {
  //   return this.service.update(data, where, userId);
  // }

  // @Permission('system:admin')
  // @Mutation(() => StandardDeleteResponse)
  // async deleteCourseDefinition(
  //   @Arg('where') where: CourseDefinitionWhereUniqueInput,
  //   @UserId() userId: string
  // ): Promise<StandardDeleteResponse> {
  //   return this.service.delete(where, userId);
  // }
}

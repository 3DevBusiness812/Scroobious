import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  CourseStepDefinitionCreateInput,
  CourseStepDefinitionCreateManyArgs,
  CourseStepDefinitionUpdateArgs,
  CourseStepDefinitionWhereArgs,
  CourseStepDefinitionWhereUniqueInput,
} from '../../../../generated';
import { CourseStepDefinition } from './course-step-definition.model';
import { CourseStepDefinitionService } from './course-step-definition.service';

@Resolver(CourseStepDefinition)
export class CourseStepDefinitionResolver {
  constructor(
    @Inject('CourseStepDefinitionService') public readonly service: CourseStepDefinitionService
  ) {}

  @Query(() => [CourseStepDefinition])
  async courseStepDefinitions(
    @Args() { where, orderBy, limit, offset }: CourseStepDefinitionWhereArgs,
    @Fields() fields: string[]
  ): Promise<CourseStepDefinition[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Query(() => CourseStepDefinition)
  async courseStepDefinition(
    @Arg('where') where: CourseStepDefinitionWhereUniqueInput
  ): Promise<CourseStepDefinition> {
    return this.service.findOne<CourseStepDefinitionWhereUniqueInput>(where);
  }

  @Mutation(() => CourseStepDefinition)
  async createCourseStepDefinition(
    @Arg('data') data: CourseStepDefinitionCreateInput,
    @UserId() userId: string
  ): Promise<CourseStepDefinition> {
    return this.service.create(data, userId);
  }

  @Mutation(() => [CourseStepDefinition])
  async createManyCourseStepDefinitions(
    @Args() { data }: CourseStepDefinitionCreateManyArgs,
    @UserId() userId: string
  ): Promise<CourseStepDefinition[]> {
    return this.service.createMany(data, userId);
  }

  @Mutation(() => CourseStepDefinition)
  async updateCourseStepDefinition(
    @Args() { data, where }: CourseStepDefinitionUpdateArgs,
    @UserId() userId: string
  ): Promise<CourseStepDefinition> {
    return this.service.update(data, where, userId);
  }

  @Mutation(() => StandardDeleteResponse)
  async deleteCourseStepDefinition(
    @Arg('where') where: CourseStepDefinitionWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.service.delete(where, userId);
  }
}

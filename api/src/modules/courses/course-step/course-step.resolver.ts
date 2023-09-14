import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, UserId } from 'warthog';
import {
  CourseStepUpdateInput,
  CourseStepWhereArgs,
  CourseStepWhereInput,
  CourseStepWhereUniqueInput,
} from '../../../../generated';
import { UpsertAction } from '../../../core';
import { UserSafe } from '../../identity/user/user.model';
import { CourseStepDefinition } from '../course-step-definition/course-step-definition.model';
import { Course } from '../course/course.model';
import { CourseStep } from './course-step.model';
import { CourseStepService } from './course-step.service';

@ArgsType()
export class CourseStepSubmitArgs {
  @Field() data!: CourseStepUpdateInput;
  @Field() where!: CourseStepWhereInput;
}

@ObjectType()
export class CourseStepSubmitResult {
  @Field(() => CourseStep)
  data!: CourseStep;

  @Field(() => Course)
  course!: Course;

  @Field(() => UpsertAction)
  action!: UpsertAction;
}

@ObjectType()
export class CourseStepDownloadResult {
  @Field(() => CourseStep)
  data!: CourseStep;

  @Field(() => UpsertAction)
  action!: UpsertAction;
}

@Resolver(CourseStep)
export class CourseStepResolver {
  constructor(@Inject('CourseStepService') public readonly service: CourseStepService) {}

  // @FieldResolver(() => Course)
  // course(@Root() courseStep: CourseStep, @Ctx() ctx: BaseContext): Promise<Course> {
  //   return ctx.dataLoader.loaders.CourseStep.course.load(courseStep);
  // }

  @FieldResolver(() => UserSafe)
  createdBy(@Root() courseStep: CourseStep, @Ctx() ctx: BaseContext): Promise<UserSafe> {
    return ctx.dataLoader.loaders.CourseStep.createdBy.load(courseStep);
  }

  @FieldResolver(() => UserSafe)
  courseStepDefinition(
    @Root() courseStep: CourseStep,
    @Ctx() ctx: BaseContext
  ): Promise<CourseStepDefinition> {
    return ctx.dataLoader.loaders.CourseStep.courseStepDefinition.load(courseStep);
  }

  @Query(() => [CourseStep])
  async courseSteps(
    @Args() { where, orderBy, limit, offset }: CourseStepWhereArgs,
    @UserId() userId: string,
    @Fields() fields: string[]
  ): Promise<CourseStep[]> {
    return this.service.find(where, orderBy, limit, offset, fields);
  }

  @Query(() => CourseStep)
  async courseStep(@Arg('where') where: CourseStepWhereUniqueInput): Promise<CourseStep> {
    return this.service.findOne<CourseStepWhereUniqueInput>(where);
  }

  @Mutation(() => CourseStepSubmitResult)
  async submitCourseStep(
    @Args() { data, where }: CourseStepSubmitArgs,
    @UserId() userId: string
  ): Promise<CourseStepSubmitResult> {
    return this.service.submit(data, where, userId);
  }

  @Mutation(() => CourseStepSubmitResult)
  async downloadCourseStep(
    @Args() { data, where }: CourseStepSubmitArgs,
    @UserId() userId: string
  ): Promise<CourseStepDownloadResult> {
    return this.service.processDownload(data, where, userId);
  }
}

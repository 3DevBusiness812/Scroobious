import {
  BaseModel,
  EnumField,
  IdField,
  IDType,
  JSONField,
  JsonObject,
  ManyToOne,
  Model,
} from 'warthog';
import { User } from '../../identity/user/user.model';
import { CourseStepDefinition } from '../course-step-definition/course-step-definition.model';
import { Course } from '../course/course.model';

export enum CourseStepStatus {
  COMPLETE = 'COMPLETE',
  NEW = 'NEW',
}
@Model()
export class CourseStep extends BaseModel {
  @EnumField('CourseStepStatus', CourseStepStatus, {
    filter: ['eq'],
    computed: true,
    default: CourseStepStatus.COMPLETE,
  })
  status!: CourseStepStatus;

  @ManyToOne(() => Course, (course: Course) => course.courseSteps)
  course!: Course;

  @IdField({ filter: ['eq'] })
  courseId!: IDType;

  @ManyToOne(() => CourseStepDefinition, 'CourseStep')
  courseStepDefinition!: CourseStepDefinition;

  // TODO: create ManyToMany between this in CourseStepDefinition
  @IdField({ filter: ['eq'] })
  courseStepDefinitionId!: IDType;

  @JSONField()
  data!: JsonObject;

  @ManyToOne(() => User, (user: User) => user.pitches)
  createdBy!: User;

  @IdField({ computed: true })
  declare createdById: IDType;
}

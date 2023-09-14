import { JoinColumn } from 'typeorm';
import {
  BaseModel,
  EnumField,
  IdField,
  IDType,
  ManyToOne,
  Model,
  OneToMany,
  OneToOne,
  StringField,
} from 'warthog';
import { Pitch } from '../../pitches/pitch/pitch.model';
import { CourseDefinition } from '../course-definition/course-definition.model';
import { CourseProduct } from '../course-product/course-product.model';
import { CourseStep } from '../course-step/course-step.model';

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  CANCELLED = 'CANCELLED',
}

@Model()
export class Course extends BaseModel {
  @EnumField('CourseStatus', CourseStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: CourseStatus.ACTIVE,
  })
  status!: CourseStatus;

  @OneToMany(() => CourseStep, (step: CourseStep) => step.course)
  courseSteps!: CourseStep[];

  @ManyToOne(
    () => CourseDefinition,
    (courseDefinition: CourseDefinition) => courseDefinition.courses
  )
  courseDefinition!: CourseDefinition;

  @IdField()
  courseDefinitionId!: IDType;

  // @ManyToOne(() => Organization, (organization: Organization) => organization.courses)
  // organization!: Organization;

  // @IdField()
  // organizationId!: IDType;

  @OneToOne(() => Pitch, 'pitch')
  @JoinColumn()
  pitch!: Pitch;

  @IdField({ computed: true })
  pitchId!: IDType;

  // TODO: refers to a CourseStepDefinition ID
  @StringField({ readonly: true })
  currentStep!: string;

  @OneToMany(() => CourseProduct, 'course', { nullable: false })
  courseProducts!: CourseProduct[];
}

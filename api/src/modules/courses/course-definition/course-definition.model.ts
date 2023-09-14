import { BaseModel, Model, OneToMany, StringField } from 'warthog';
import { CourseDefinitionProduct } from '../course-definition-product/course-definition-product.model';
import { CourseStepDefinition } from '../course-step-definition/course-step-definition.model';
import { Course } from '../course/course.model';

@Model()
export class CourseDefinition extends BaseModel {
  @StringField({ filter: ['eq'] })
  name!: string;

  @StringField()
  description!: string;

  @OneToMany(() => CourseStepDefinition, (step: CourseStepDefinition) => step.courseDefinition)
  courseStepDefinitions!: CourseStepDefinition[];

  @OneToMany(() => Course, (course: Course) => course.courseDefinition)
  courses!: Course[];

  @OneToMany(
    () => CourseDefinitionProduct,
    (cdst: CourseDefinitionProduct) => cdst.courseDefinition
  )
  courseDefinitionProducts!: CourseDefinitionProduct[];
}

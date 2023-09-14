// A product is a service that Scroobious offers it's users.  Example: 1:1 feedback
import { BaseModel, ManyToMany, Model, OneToMany, StringField } from 'warthog';
import { CourseDefinitionProduct } from '../../courses/course-definition-product/course-definition-product.model';
import { CourseProduct } from '../../courses/course-product/course-product.model';

@Model()
export class Product extends BaseModel {
  // TODO: ADD SKU (should this be the id though or separate field?)
  @StringField()
  name!: string;

  @StringField()
  description!: string;

  @ManyToMany(() => CourseDefinitionProduct, (cdst: CourseDefinitionProduct) => cdst.product)
  courseDefinitionProducts!: CourseDefinitionProduct[];

  @OneToMany(() => CourseProduct, 'course')
  courseProducts!: CourseProduct[];
}

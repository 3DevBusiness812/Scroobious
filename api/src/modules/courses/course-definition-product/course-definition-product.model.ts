// This model represents all services that are included with a given course.
// i.e. for the "Pitch it Plan," we include 2 1:1 written reviews and 1 Zoom session
// BEST_PRACTICE: Join table with additional metadata.
//   This joins CourseDefinition with Product with additional attributes
//   To do this, we don't use a ManyToMany, but rather a ManyToOne in the middle and add
//   our additional properties directly to this table.
import { BaseModel, IdField, IDType, ManyToOne, Model, StringField } from 'warthog';
import { Product } from '../../products/product/product.model';
import { CourseDefinition } from '../course-definition/course-definition.model';

@Model()
export class CourseDefinitionProduct extends BaseModel {
  @StringField()
  name!: string;

  @StringField()
  description!: string;

  @ManyToOne(
    () => CourseDefinition,
    (courseDefinition: CourseDefinition) => courseDefinition.courseDefinitionProducts
  )
  courseDefinition!: CourseDefinition;

  @IdField()
  courseDefinitionId!: IDType;

  @ManyToOne(() => Product, (product: Product) => product.courseDefinitionProducts)
  product!: Product;

  @IdField()
  productId!: IDType;
}

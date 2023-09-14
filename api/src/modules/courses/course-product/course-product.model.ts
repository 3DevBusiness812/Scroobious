// This represents the status of the individual products for this instance of the course
// Ex: for the Pitch it Plan, you get 2 written reviews and a single 1:1 zoom call
//     when the course (pitch it plan instance for a user) is created, we'll create
//     three "CourseProduct" records (by reading CourseDefinitionProduct) and creating one of these
//     records for each item in that join table.  They'll be initialized as "Available" and then go through
//     a state machine of AVAILABLE -> COMPLETE
import { BaseModel, EnumField, IdField, IDType, ManyToOne, Model } from 'warthog';
import { Product } from '../../products/product/product.model';
import { Course } from '../course/course.model';

export enum CourseProductStatus {
  AVAILABLE = 'AVAILABLE',
  COMPLETE = 'COMPLETE',
  COMPLETE_MIGRATED = 'COMPLETE_MIGRATED', // For migrated users, we set to MIGRATED so that they can't navigate to the show page in the app as we don't actually have the feedback saved anywhere
}

@Model()
export class CourseProduct extends BaseModel {
  @ManyToOne(() => Course, (course: Course) => course.courseProducts)
  course?: Course;

  @IdField({ filter: ['eq'] })
  courseId!: IDType;

  @ManyToOne(() => Product, (product: Product) => product.courseProducts)
  product?: Product;

  @IdField()
  productId!: IDType;

  // ID of associated object created from course_product
  // (i.e. PitchWrittenFeedback or PitchMeetingFeedback)
  @IdField({ nullable: true })
  objectId!: IDType;

  @EnumField('CourseProductStatus', CourseProductStatus, {
    filter: ['eq'],
    nullable: false,
    default: CourseProductStatus.AVAILABLE,
  })
  status!: CourseProductStatus;
}

import { Inject, Service } from 'typedi';
import { EntityManager, getManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService } from 'warthog';
import { CourseProductCreateInput, CourseProductWhereUniqueInput } from '../../../../generated';
import { CourseDefinitionProductService } from '../course-definition-product/course-definition-product.service';
import { CourseProduct, CourseProductStatus } from './course-product.model';

interface CourseProductClaim {
  id: string;
  objectId: string;
  ownerId?: string;
}

interface ISingleCourseProduct {
  courseId: string,
  ownerId: string,
  productId: string
}

@Service('CourseProductService')
export class CourseProductService extends BaseService<CourseProduct> {
  constructor(
    public readonly courseDefinitionProductService: CourseDefinitionProductService,
    @Inject('CourseProductService')
    @InjectRepository(CourseProduct)
    protected readonly repository: Repository<CourseProduct>
  ) {
    super(CourseProduct, repository);
  }

  // TODO: create claim method
  // Check balance of remaining course services
  // Claim this record
  @Transaction()
  async claim(
    input: CourseProductClaim,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ) {
    const manager = options?.manager || transactionManager;

    const courseProduct = await this.findOne({ id: input.id });

    if (courseProduct.status !== CourseProductStatus.AVAILABLE) {
      throw new Error(
        `Unable to request course feedback. courseProduct with ID ${input.id} has already been used`
      );
    }

    return this.update(
      { status: CourseProductStatus.COMPLETE, objectId: input.objectId, ownerId: input.ownerId },
      { id: courseProduct.id },
      userId,
      {
        manager,
      }
    );
  }

  async transition(
    status: CourseProductStatus,
    where: CourseProductWhereUniqueInput,
    userId: string
  ) {
    return this.update({ status }, where, userId);
  }

  async createCourse(data: CourseProductCreateInput, userId: string): Promise<CourseProduct> {
    const courseId = data.courseId;
    const productId = data.productId;

    return getManager().transaction(async (manager: EntityManager) => {
      const course = await this.create({ courseId, productId }, userId, { manager });
      return course;
    });
  }

  async createSingleCourse(data: ISingleCourseProduct): Promise<CourseProduct> {
    const courseId = data.courseId;
    const productId = data.productId;
    const userId = data.ownerId;

    return await this.create({ courseId, productId }, userId)
  }
}

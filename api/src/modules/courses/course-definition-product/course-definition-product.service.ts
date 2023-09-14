import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { CourseDefinitionProduct } from './course-definition-product.model';

@Service('CourseDefinitionProductService')
export class CourseDefinitionProductService extends BaseService<CourseDefinitionProduct> {
  constructor(
    @InjectRepository(CourseDefinitionProduct)
    protected readonly repository: Repository<CourseDefinitionProduct>
  ) {
    super(CourseDefinitionProduct, repository);
  }
}

import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { SuggestedResourceCategory } from './suggested-resource-category.model';

@Service('SuggestedResourceCategoryService')
export class SuggestedResourceCategoryService extends BaseService<SuggestedResourceCategory> {
  constructor(
    @InjectRepository(SuggestedResourceCategory)
    protected readonly repository: Repository<SuggestedResourceCategory>
  ) {
    super(SuggestedResourceCategory, repository);
  }
}

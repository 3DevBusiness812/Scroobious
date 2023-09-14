import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { PerkCategory } from './perk-category.model';

@Service('PerkCategoryService')
export class PerkCategoryService extends BaseService<PerkCategory> {
  constructor(
    @InjectRepository(PerkCategory) protected readonly repository: Repository<PerkCategory>
  ) {
    super(PerkCategory, repository);
  }
}

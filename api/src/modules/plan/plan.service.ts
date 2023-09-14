import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { Plan } from './plan.model';

@Service('PlanService')
export class PlanService extends BaseService<Plan> {
  constructor(@InjectRepository(Plan) protected readonly repository: Repository<Plan>) {
    super(Plan, repository);
  }
}

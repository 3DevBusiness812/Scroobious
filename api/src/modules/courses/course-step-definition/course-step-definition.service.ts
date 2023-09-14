import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { CourseStepDefinition } from './course-step-definition.model';

@Service('CourseStepDefinitionService')
export class CourseStepDefinitionService extends BaseService<CourseStepDefinition> {
  constructor(
    @InjectRepository(CourseStepDefinition)
    protected readonly repository: Repository<CourseStepDefinition>
  ) {
    super(CourseStepDefinition, repository);
  }
}

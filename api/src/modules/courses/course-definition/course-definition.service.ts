import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { CourseStepDefinitionService } from '../course-step-definition/course-step-definition.service';
import { CourseDefinition } from './course-definition.model';

@Service('CourseDefinitionService')
export class CourseDefinitionService extends BaseService<CourseDefinition> {
  constructor(
    @InjectRepository(CourseDefinition) protected readonly repository: Repository<CourseDefinition>,
    @Inject('CourseStepDefinitionService')
    public readonly courseStepDefinitionService: CourseStepDefinitionService
  ) {
    super(CourseDefinition, repository);
  }

  async getFirstStepId(courseDefinitionId: string): Promise<string> {
    const steps = await this.courseStepDefinitionService.find(
      { courseDefinitionId_eq: courseDefinitionId },
      'sequenceNum_ASC',
      1
    );

    if (!steps || !steps.length) {
      throw new Error('Course Definition doesnt have steps');
    }

    return steps[0].id;
  }
}

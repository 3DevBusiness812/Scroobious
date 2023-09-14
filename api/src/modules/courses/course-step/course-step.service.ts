import { Inject, Service } from 'typedi';
import { DeepPartial, EntityManager, Repository, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { UserActivityService } from '../../core/user-activity/user-activity.service';
import { CourseStepDefinitionType } from '../course-step-definition/course-step-definition.model';
import { CourseStepDefinitionService } from '../course-step-definition/course-step-definition.service';
import { CourseService } from '../course/course.service';
import { CourseStep } from './course-step.model';

@Service('CourseStepService')
export class CourseStepService extends BaseService<CourseStep> {
  constructor(
    @InjectRepository(CourseStep) protected readonly repository: Repository<CourseStep>,
    @Inject('CourseStepDefinitionService')
    public readonly courseStepDefinitionService: CourseStepDefinitionService,
    @Inject('UserActivityService')
    public readonly userActivityService: UserActivityService,
    @Inject('CourseService')
    public readonly courseService: CourseService
  ) {
    super(CourseStep, repository);
  }

  async getStepDefinition(where: any) {
    if (!where.courseId_eq) {
      throw new Error('where.courseId_eq is required');
    }
    if (!where.courseStepDefinitionId_eq) {
      throw new Error('where.courseStepDefinitionId_eq is required');
    }
    const courseStepDefinitionId = where.courseStepDefinitionId_eq;

    const stepDefinition = await this.courseStepDefinitionService.findSingle({
      id: courseStepDefinitionId,
    });
    if (!stepDefinition) {
      throw new Error('Step definition not found');
    }

    return stepDefinition;
  }

  async processDownload(inputData: DeepPartial<CourseStep>, where: any, userId: string) {
    const payload = {
      ...inputData,
      data: {
        downloaded: true,
        downloadedAt: new Date().toISOString(),
      },
    };

    return this.upsert(payload, where, userId, { eventType: 'download' });
  }

  async submit(
    inputData: DeepPartial<CourseStep>,
    where: any,
    userId: string,
    options?: any, // MutateOptions
    @TransactionManager() transactionManager?: EntityManager
  ) {
    const manager = options?.manager || transactionManager;
    const stepDefinition = await this.getStepDefinition(where);
    const courseId = where.courseId_eq;

    // Validate the data that comes in by step type
    switch (stepDefinition.type) {
      case CourseStepDefinitionType.DOWNLOAD:
      case CourseStepDefinitionType.MARKDOWN:
      case CourseStepDefinitionType.VIDEO:
      case CourseStepDefinitionType.INSTRUCTIONS:
        break;

      case CourseStepDefinitionType.FORM:
        // TODO: there should at least be SOME form data
        break;

      default:
        break;
    }

    // Do Course bookkeeping. Set next step number and status
    // console.log('stepDefinition.sequenceNum :>> ', stepDefinition.sequenceNum);

    const courseStepDefinitions = await this.courseStepDefinitionService.find(
      { sequenceNum_gt: stepDefinition.sequenceNum },
      'sequenceNum_ASC',
      1
    );
    const nextCourseStepDefintion =
      courseStepDefinitions && courseStepDefinitions.length ? courseStepDefinitions[0] : null;
    const nextStepDefId = (nextCourseStepDefintion && nextCourseStepDefintion.id) || undefined;

    let course;
    course = await this.courseService.updateCurrentStep({ id: courseId }, nextStepDefId, userId);

    // Logic currently hardcoded so that if we're at the last step (according to sequence number), we close the course itself
    // In the future, we might want to have this configurable
    if (!nextCourseStepDefintion) {
      course = await this.courseService.complete({ id: courseId }, userId);
    }

    const result = await this.upsert(inputData, where, userId, { ...options, manager });

    // If this step was configured to fire an event that can be picked up by a batch job, do it
    const eventType = stepDefinition.eventType;
    // console.log('stepDefinition :>> ', stepDefinition);
    // console.log('eventType :>> ', eventType);
    if (eventType && typeof eventType === 'string') {
      await this.userActivityService.create({ eventType: eventType }, userId);
    }

    return { ...result, course };
  }

  // async create(data: Partial<CourseStep>, userId: string): Promise<CourseStep> {
  //   if (!data.courseDefinitionId) {
  //     throw new Error("'courseDefinitionId' is required");
  //   }

  //   const currentStep = await this.courseDefinitionService.getFirstStepId(data.courseDefinitionId);
  //   const payload = {
  //     ...data,
  //     currentStep,
  //   };

  //   return super.create(payload, userId);
  // }

  // async query(
  //   where: any = {}, // TODO: fix any
  //   userId: string,
  //   orderBy?: string,
  //   limit?: number,
  //   offset?: number,
  //   fields?: string[]
  // ): Promise<Course[]> {
  //   // The list of courses should always be filtered to "mine"
  //   const myWorld = { ownerId: userId };

  //   where = {
  //     ...where,
  //     ...myWorld,
  //   };

  //   return this.find(where, orderBy, limit, offset, fields);
  // }
}

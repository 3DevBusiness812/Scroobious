import { Inject, Service } from 'typedi';
import { EntityManager, getManager, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CourseCreateInput, CourseWhereUniqueInput } from '../../../../generated';
import { BaseService } from '../../../core';
import { StartupService } from '../../founder/startup/startup.service';
import { User } from '../../identity/user/user.model';
import { PitchService } from '../../pitches/pitch/pitch.service';
import { CourseDefinitionProductService } from '../course-definition-product/course-definition-product.service';
import { CourseDefinitionService } from '../course-definition/course-definition.service';
import { CourseProductService } from '../course-product/course-product.service';
import { Course, CourseStatus } from './course.model';

@Service('CourseService')
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course) protected readonly repository: Repository<Course>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @Inject('CourseDefinitionService')
    public readonly courseDefinitionService: CourseDefinitionService,
    @Inject('CourseDefinitionProductService')
    public readonly courseDefinitionProductService: CourseDefinitionProductService,
    @Inject('CourseProductService')
    public readonly courseProductService: CourseProductService,
    @Inject('PitchService')
    public readonly pitchService: PitchService,
    @Inject('StartupService')
    public readonly startupService: StartupService
  ) {
    super(Course, repository);
  }

  async findByOwnerId(ownerId: string) {
    return this.repository.findOneOrFail({ ownerId: ownerId });
  }

  async complete(where: CourseWhereUniqueInput, userId: string): Promise<Course> {
    const course = await this.update({ status: CourseStatus.COMPLETE }, where, userId, {
      eventType: 'complete',
    });
    if (course.pitchId) {
      await this.pitchService.setActive(course.pitchId, userId);
    }
    return course;
  }

  async updateCurrentStep(
    where: CourseWhereUniqueInput,
    stepId: string | undefined,
    userId: string
  ): Promise<Course> {
    return this.update({ currentStep: stepId }, where, userId);
  }

  async create(data: CourseCreateInput, userId: string): Promise<Course> {
    if (!data.courseDefinitionId) {
      throw new Error("'courseDefinitionId' is required");
    }
    const courseDefinitionId = data.courseDefinitionId;

    const startup = await this.startupService.findOne({ userId }, userId);
    // console.log('startup :>> ', startup);

    return getManager().transaction(async (manager: EntityManager) => {
      // We ask the user for the following fields during onboarding
      // When we create their "pitch" object, we want to copy those values into the
      // pitch to pre-populate and then allow them to change the values as they get
      // more comfortable with their pitch
      const pitch = await this.pitchService.create(
        {
          deckComfortLevel: startup.deckComfortLevel,
          presentationComfortLevel: startup.presentationComfortLevel,
          shortDescription: startup.shortDescription,
          presentationStatus: startup.presentationStatus,
        },
        userId,
        { manager }
      );

      const currentStep = await this.courseDefinitionService.getFirstStepId(courseDefinitionId);
      const payload = {
        ...data,
        pitchId: pitch.id,
        currentStep,
      };

      const course = await super.create(payload, userId, { manager });

      const user = await this.userRepository.findOne({ id: userId });

      if (user && user.capabilities.includes('FOUNDER_FULL')) {
        const products = await this.courseDefinitionProductService.find({
          courseDefinitionId_eq: courseDefinitionId,
        });

        await this.courseProductService.createMany(
          products.map((st) => {
            return {
              courseId: course.id,
              productId: st.productId,
            };
          }),
          userId,
          { manager }
        );
      }

      return course;
    });
  }

  async query(
    where: any = {}, // TODO: fix any
    userId: string,
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Course[]> {
    // The list of courses should always be filtered to "mine"
    const myWorld = { ownerId: userId };

    where = {
      ...where,
      ...myWorld,
    };

    return this.find(where, orderBy, limit, offset, fields);
  }
}

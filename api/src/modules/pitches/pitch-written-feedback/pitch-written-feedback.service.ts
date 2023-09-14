import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager, Brackets } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { PitchWrittenFeedbackWhereUniqueInput } from '../../../../generated';
import { BaseService } from '../../../core';
import { PermissionService } from '../../access-management/permission/permission.service';
import { CourseProductService } from '../../courses/course-product/course-product.service';
import { PitchDeckService } from '../pitch-deck/pitch-deck.service';
import { PitchService } from '../pitch/pitch.service';
import { PitchWrittenFeedback, PitchWrittenFeedbackStatus } from './pitch-written-feedback.model';
import {
  PitchWrittenFeedbackAssignInput,
  PitchWrittenFeedbackCompleteInput,
  PitchWrittenFeedbackRequestInput,
  PitchWrittenFeedbackRequestRetainDeckInput
} from './pitch-written-feedback.resolver';
import { User, UserCapability } from '../../identity/user/user.model';

@Service('PitchWrittenFeedbackService')
export class PitchWrittenFeedbackService extends BaseService<PitchWrittenFeedback> {
  constructor(
    @InjectRepository(PitchWrittenFeedback)
    protected readonly repository: Repository<PitchWrittenFeedback>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @Inject('PitchService') public readonly pitchService: PitchService,
    @Inject('PitchDeckService') public readonly pitchDeckService: PitchDeckService,
    @Inject('CourseProductService')
    public readonly courseProductService: CourseProductService,
    @Inject('PermissionService') public readonly permissionService: PermissionService
  ) {
    super(PitchWrittenFeedback, repository);
  }

  async myWorldFilter(userId?: string) {
    if (!userId) {
      throw new Error('userId is required in my world filter');
    }

    // console.log('userId :>> ', userId);
    const permissions = await this.permissionService.permissionsForUser(userId);
    // console.log('permissions :>> ', permissions);
    const hasAdminPermissions = permissions.indexOf('pitch_written_feedback:admin') > -1;

    return hasAdminPermissions
      ? {}
      : {
          ownerId_eq: userId,
        };
  }

  async find(
    where: any = {}, // TODO: fix any
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[],
    userId?: string
  ): Promise<PitchWrittenFeedback[]> {
    // console.log(`this.service.klass`, this.service.klass);

    const myWorld = await this.myWorldFilter(userId);
    // console.log('myWorld :>> ', myWorld);

    where = {
      ...where,
      ...myWorld,
    };

    const user = await this.userRepository.findOne({ id: userId });

    // If user is Reviewer Only - he can only get REQUESTED pitches, or pitches assigned to them
    const userIsReviewerOnly =
        user &&
        user.capabilities.includes(UserCapability.REVIEWER) &&
        !(user.capabilities.includes(UserCapability.ADMIN) || user.capabilities.includes(UserCapability.SYSTEM_ADMIN))

    const findQuery = this.buildFindQuery(
        where,
        orderBy,
        { limit: limit || 20, offset: offset },
        fields,
        userId
    )

    // For reviewer only - add restriction from seeing pitches assigned to others
    if (userIsReviewerOnly) {
      findQuery.andWhere(new Brackets((subQuery) => {
        subQuery.where('reviewer_id = :reviewer_id', {reviewer_id: userId})
        subQuery.orWhere('reviewer_id IS NULL')
      }))
    }

    return findQuery.getMany()
  }

  @Transaction()
  async request(
    data: PitchWrittenFeedbackRequestInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchWrittenFeedback> {
    const manager = options?.manager || transactionManager;
    // console.log('PitchWrittenFeedback:request data :>> ', data);

    const { pitchDeck: pitchDeckInput, ...pitchWrittenFeedbackinput } = data;
    const pitchDeck = await this.pitchDeckService.createExtended(
      { ...pitchDeckInput },
      userId,
      {
        manager,
      }
    );

    const courseProduct = await this.courseProductService.findOne(
      { id: data.courseProductId },
      userId,
      { manager }
    );

    const pitchWrittenFeedbackData: Partial<PitchWrittenFeedback> = {
      ...pitchWrittenFeedbackinput,
      originalPitchDeckId: pitchDeck.id,
      courseProductId: courseProduct.id,
    };
    const writtenFeedback = await super.create(pitchWrittenFeedbackData, userId, {
      manager,
      eventType: 'request',
    });

    // TODO: change this signature to take in a courseProduct
    await this.courseProductService.claim(
      { id: data.courseProductId, objectId: writtenFeedback.id },
      userId,
      { manager }
    );

    // Request Feedback --> Pitch Deck Submission screen --> clicks Submit	written-feedback-requested	Deck Submitted	Deck Submitted	Email, First Name

    return writtenFeedback;
  }

  @Transaction()
  async requestFeedback(
    data: PitchWrittenFeedbackRequestRetainDeckInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchWrittenFeedback> {
    const manager = options?.manager || transactionManager;

    const { pitchDeck, ...pitchWrittenFeedbackinput } = data;

    const courseProduct = await this.courseProductService.findOne(
      { id: data.courseProductId },
      userId,
      { manager }
    );

    const pitchWrittenFeedbackData: Partial<PitchWrittenFeedback> = {
      ...pitchWrittenFeedbackinput,
      originalPitchDeckId: pitchDeck.id,
      courseProductId: courseProduct.id,
    };
    const writtenFeedback = await super.create(pitchWrittenFeedbackData, userId, {
      manager,
      eventType: 'request',
    });

    // TODO: change this signature to take in a courseProduct
    await this.courseProductService.claim(
      { id: data.courseProductId, objectId: writtenFeedback.id },
      userId,
      { manager }
    );

    // Request Feedback --> Pitch Deck Submission screen --> clicks Submit	written-feedback-requested	Deck Submitted	Deck Submitted	Email, First Name

    return writtenFeedback;
  }

  async assign(
    data: PitchWrittenFeedbackAssignInput,
    where: PitchWrittenFeedbackWhereUniqueInput,
    userId: string
  ): Promise<PitchWrittenFeedback> {
    // console.log('where :>> ', where);
    const feedback = await this.findOne(where, userId);
    if (feedback.status === PitchWrittenFeedbackStatus.COMPLETE) {
      throw new Error('You cannot reassign feedback that is already complete');
    }

    const pitchWrittenFeedbackData: Partial<PitchWrittenFeedback> = {
      ...data,
      status: PitchWrittenFeedbackStatus.ASSIGNED,
    };

    // console.log('PitchWrittenFeedback:assign pitchWrittenFeedbackData :>> ', pitchWrittenFeedbackData);
    return super.update(pitchWrittenFeedbackData as any, where, userId);
  }

  @Transaction()
  async complete(
    data: PitchWrittenFeedbackCompleteInput,
    where: PitchWrittenFeedbackWhereUniqueInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchWrittenFeedback> {
    const manager = options?.manager || transactionManager;
    // console.log('PitchWrittenFeedback:complete data :>> ', data);

    const { pitchDeck: pitchDeckInput, ...pitchWrittenFeedbackinput } = data;
    const pitchDeck = await this.pitchDeckService.createExtended(
      { ...pitchDeckInput, draft: true },
      userId,
      {
        manager,
      }
    );

    const pitchWrittenFeedbackData: Partial<PitchWrittenFeedback> = {
      ...pitchWrittenFeedbackinput,
      status: PitchWrittenFeedbackStatus.COMPLETE,
      reviewedPitchDeckId: pitchDeck.id,
    };
    const writtenFeedback = await super.update(pitchWrittenFeedbackData, where, userId, {
      manager,
      eventType: 'complete',
    });

    // TODO: async task to create email

    return writtenFeedback;
  }
}

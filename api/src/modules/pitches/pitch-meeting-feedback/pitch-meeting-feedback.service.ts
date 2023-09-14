import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { PitchMeetingFeedbackWhereUniqueInput } from '../../../../generated';
import { BaseService } from '../../../core';
import { PermissionService } from '../../access-management/permission/permission.service';
import { FileService } from '../../core/file/file.service';
import { CourseProductService } from '../../courses/course-product/course-product.service';
import { PitchMeetingFeedback, PitchMeetingFeedbackStatus } from './pitch-meeting-feedback.model';
import {
  PitchMeetingFeedbackAssignInput,
  PitchMeetingFeedbackCompleteInput,
  PitchMeetingFeedbackRequestInput,
} from './pitch-meeting-feedback.resolver';

@Service('PitchMeetingFeedbackService')
export class PitchMeetingFeedbackService extends BaseService<PitchMeetingFeedback> {
  constructor(
    @InjectRepository(PitchMeetingFeedback)
    protected readonly repository: Repository<PitchMeetingFeedback>,
    @Inject('CourseProductService')
    public readonly courseProductService: CourseProductService,
    @Inject('FileService') public readonly fileService: FileService,
    @Inject('PermissionService') public readonly permissionService: PermissionService
  ) {
    super(PitchMeetingFeedback, repository);
  }

  async myWorldFilter(userId?: string) {
    if (!userId) {
      throw new Error('userId is required in my world filter');
    }

    // console.log('userId :>> ', userId);
    const permissions = await this.permissionService.permissionsForUser(userId);
    // console.log('permissions :>> ', permissions);
    const hasAdminPermissions = permissions.indexOf('pitch_meeting_feedback:admin') > -1;

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
  ): Promise<PitchMeetingFeedback[]> {
    // console.log(`this.service.klass`, this.service.klass);

    const myWorld = await this.myWorldFilter(userId);
    // console.log('myWorld :>> ', myWorld);

    where = {
      ...where,
      ...myWorld,
    };

    return this.buildFindQuery(
      where,
      orderBy,
      { limit: limit || 20, offset: offset },
      fields,
      userId
    ).getMany();
  }

  @Transaction()
  async request(
    data: PitchMeetingFeedbackRequestInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchMeetingFeedback> {
    const manager = options?.manager || transactionManager;
    // console.log('data :>> ', data);
    const meetingFeedback = await super.create(data, data.ownerId, {
      manager,
      eventType: 'request',
    });

    await this.courseProductService.claim(
      { id: data.courseProductId, objectId: meetingFeedback.id, ownerId: data.ownerId },
      userId,
      { manager }
    );

    // TODO: async task to create email

    return meetingFeedback;
  }

  async assign(
    data: PitchMeetingFeedbackAssignInput,
    where: PitchMeetingFeedbackWhereUniqueInput,
    userId: string
  ): Promise<PitchMeetingFeedback> {
    // console.log('where :>> ', where);
    const feedback = await this.findOne(where, userId);
    if (feedback.status === PitchMeetingFeedbackStatus.COMPLETE) {
      throw new Error('You cannot reassign feedback that is already complete');
    }

    const pitchMeetingFeedbackData: Partial<PitchMeetingFeedback> = {
      ...data,
      status: PitchMeetingFeedbackStatus.ASSIGNED,
    };

    // console.log('PitchMeetingFeedback:assign pitchMeetingFeedbackData :>> ', pitchMeetingFeedbackData);
    return super.update(pitchMeetingFeedbackData as any, where, userId);
  }

  @Transaction()
  async complete(
    data: PitchMeetingFeedbackCompleteInput,
    where: PitchMeetingFeedbackWhereUniqueInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchMeetingFeedback> {
    const manager = options?.manager || transactionManager;
    // console.log('PitchMeetingFeedback:complete data :>> ', data);
    const file = await this.fileService.create({ url: data.file.url }, userId, { manager });

    const pitchMeetingFeedbackData: Partial<PitchMeetingFeedback> = {
      ...data,
      status: PitchMeetingFeedbackStatus.COMPLETE,
      recordingFileId: file.id,
    };
    const meetingFeedback = await super.update(pitchMeetingFeedbackData, where, userId, {
      manager,
      eventType: 'complete',
    });

    // TODO: async task to create email

    return meetingFeedback;
  }
}

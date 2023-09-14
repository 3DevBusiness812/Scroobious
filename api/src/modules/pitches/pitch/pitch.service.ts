import { Inject, Service } from 'typedi';
import {Brackets, Repository} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions';
import { camelCase } from 'typeorm/util/StringUtils';
import { BaseOptionsExtended } from 'warthog';
import { PitchCreateInput, PitchWhereUniqueInput } from '../../../../generated';
import { BaseService } from '../../../core';
import { PermissionService } from '../../access-management/permission/permission.service';
import { WistiaService } from '../../core/wistia/wistia.service';
import { FounderProfile } from '../../founder/founder-profile/founder-profile.model';
import { Startup } from '../../founder/startup/startup.model';
import { Organization } from '../../identity/organization/organization.model';
import { OrganizationService } from '../../identity/organization/organization.service';
import { User, UserCapability } from '../../identity/user/user.model';
import { PitchListStatus, PitchUserStatus } from '../pitch-user-status/pitch-user-status.model'
import { PitchUserStatusService } from '../pitch-user-status/pitch-user-status.service'
import { PitchVideo } from '../pitch-video/pitch-video.model';
import { Pitch, PitchStatus } from './pitch.model';

@Service('PitchService')
export class PitchService extends BaseService<Pitch> {
  constructor(
    @InjectRepository(Pitch) protected readonly repository: Repository<Pitch>,
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    @Inject('OrganizationService') public readonly organizationService: OrganizationService,
    @Inject('PermissionService') public readonly permissionService: PermissionService,
    @Inject('WistiaService') public readonly wistiaService: WistiaService,
    @Inject('PitchUserStatusService') public readonly pitchUserStatusService: PitchUserStatusService
  ) {
    super(Pitch, repository);
  }

  async create(
    data: PitchCreateInput,
    userId: string,
    options?: BaseOptionsExtended
  ): Promise<Pitch> {
    // console.log('PitchService.create :>> ', data);

    // Default the user's organization here
    const organizations = await this.organizationService.find({ userId });
    if (!organizations || !organizations.length) {
      throw new Error("Expected to find user's organization");
    }
    const organizationId = organizations[0].id;

    return super.create(
      {
        ...data,
        userId,
        organizationId,
      },
      userId,
      options
    );
  }

  async setActive(pitchId: string, userId: string) {
    return this.update({ status: PitchStatus.ACTIVE }, { id: pitchId }, userId);
  }

  async getMyWorldFilter(userId: string) {
    const permissions = await this.permissionService.permissionsForUser(userId);
    // console.log('permissions :>> ', permissions);

    const hasListPitchPermissions = permissions.indexOf('pitch:list') > -1;
    const hasReviewerPermissions = permissions.indexOf('pitch:review') > -1;

    if (hasReviewerPermissions) {
      return {}; // Reviewers can see everything
    }

    // If they have pitch:list permissions, they are an investor
    // Therefore, just show published pitches
    // Otherwise, they're a founder and we should only show "my pitches"
    return hasListPitchPermissions ? { status: PitchStatus.PUBLISHED } : { ownerId_eq: userId };
  }

  async getUserIsInvestorOnly(userId: string): Promise<undefined | boolean> {
    const user = await this.userRepository.findOne({ id: userId });

    // User is Investor Only
    return user &&
        user.capabilities.includes(UserCapability.INVESTOR) &&
        !(user.capabilities.includes(UserCapability.ADMIN) || user.capabilities.includes(UserCapability.SYSTEM_ADMIN))
  }

  // Load pitch and, if investor, add event to user_activity for further aggregation
  async findPitch<W>(where: W, userId: string): Promise<Pitch> {
    const pitch = await this.findOne(where);

    const userIsInvestorOnly = await this.getUserIsInvestorOnly(userId)

    if (pitch && userIsInvestorOnly) {
      await this.pitchUserStatusService.upsert({ pitchId: pitch.id }, { pitchId_eq: pitch.id }, userId);
    }

    return pitch
  }

  async query(
    where: any = {}, // TODO: fix any
    userId: string,
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Pitch[]> {
    // console.log('where :>> ', where);
    // console.log('userId :>> ', userId);
    // console.log('orderBy :>> ', orderBy);

    let filters = { ...where };

    const filterOnly: any = {};
    const filterOnlyProps = [
      'watchStatus_eq',
      'listStatus_eq',
      'femaleLeader_eq',
      'minorityLeader_eq',
      'industry_eq',
      'stateProvince_eq',
      'fundingStatus_eq',
      'companyStage_eq',
      'revenue_eq',
      'femaleLeader_eq',
      'minorityLeader_eq',
    ];

    filterOnlyProps.forEach((item: string) => {
      if (filters[item]) {
        filterOnly[item] = filters[item];
      }
      delete filters[item];
    });

    limit = limit || 20;

    // Finally add "my world" filtering to reduce query set down to
    // What the logged in user should see.  i.e. founders see their own and investors see all pitches
    const myWorldFilter = await this.getMyWorldFilter(userId);
    filters = {
      ...filters,
      ...myWorldFilter,
    };

    const userIsInvestorOnly = await this.getUserIsInvestorOnly(userId)

    // console.log('filters :>> ', filters);

    let qb = this.buildFindQuery(filters, orderBy, { limit, offset }, fields);

    // If we're not filtering on bookmarked or ignored, we want to left join to this table
    // so that we can show a visual indicator of the status.  If we're filtering on one of these properties
    // it should be an inner join instead
    if (!filterOnly.listStatus_eq) {
      // Filter out Passed pitches if user is investor and listStatus filter is not applied
      qb = qb.leftJoinAndSelect(
          PitchUserStatus,
          'user_status',
          'user_status.pitch_id = pitch.id AND user_status.user_id = :userId',
          {
            userId,
          }
      );

      if (userIsInvestorOnly) {
        qb = qb.andWhere(new Brackets((subQuery) => {
          subQuery.where('user_status.list_status != :status', {status: PitchListStatus.IGNORE})
          subQuery.orWhere('user_status.list_status IS NULL')
        }))
      }
    } else {
      qb = qb.innerJoinAndSelect(
        PitchUserStatus,
        'user_status',
        'user_status.pitch_id = pitch.id AND user_status.user_id = :userId AND user_status.list_status = :status',
        {
          userId,
          status: filterOnly.listStatus_eq,
        }
      );
    }

    qb = qb
      .innerJoin(Organization, 'organization', 'organization.id = pitch.organization_id')
      .innerJoin(Startup, 'startup', 'startup.organization_id = organization.id')
      .innerJoin(User, 'user', 'user.id = pitch.user_id')
      .innerJoin(FounderProfile, 'founder_profile', 'founder_profile.user_id = user.id');
    // .where('1=1');

    if (filterOnly.industry_eq) {
      qb = qb.andWhere('startup.industries && :industry_eq', {
        industry_eq: Array.isArray(filterOnly.industry_eq)
          ? filterOnly.industry_eq
          : [filterOnly.industry_eq],
      });
    }

    if (filterOnly.stateProvince_eq) {
      qb = qb.andWhere('startup.state_province = :stateProvince_eq', {
        stateProvince_eq: filterOnly.stateProvince_eq,
      });
    }

    if (filterOnly.fundingStatus_eq) {
      qb = qb.andWhere('startup.fundraise_status = :fundingStatus_eq', {
        fundingStatus_eq: filterOnly.fundingStatus_eq,
      });
    }

    if (filterOnly.companyStage_eq) {
      qb = qb.andWhere('startup.company_stage = :companyStage_eq', {
        companyStage_eq: filterOnly.companyStage_eq,
      });
    }

    if (filterOnly.revenue_eq) {
      qb = qb.andWhere('startup.revenue = :revenue_eq', {
        revenue_eq: filterOnly.revenue_eq,
      });
    }

    if (filterOnly.femaleLeader_eq) {
      qb = qb.andWhere('founder_profile.gender = :femaleLeader_eq', {
        femaleLeader_eq: 'WOMAN',
      });
    }

    if (filterOnly.minorityLeader_eq) {
      qb = qb.andWhere('NOT (founder_profile.ethnicities && :minorityLeader_eq)', {
        minorityLeader_eq: ['WHITE'],
      });
    }

    // 'watchStatus_eq',

    const queryResult = await qb
      .select(['pitch.*', 'user_status.list_status', 'user_status.watch_status'])
      .take(limit)
      .limit(limit)
      .skip(offset)
      .offset(offset)
      .getRawMany();

    // Since we used `getRawMany`, we need to re-camelCase the attributes
    return queryResult.map((item) => {
      return Object.keys(item).reduce((result: { [key: string]: any }, key: string) => {
        result[camelCase(key)] = item[key];
        return result;
      }, {});
    }) as Pitch[];
  }

  // Founder can only publish their own pitches.
  async canPublishUnpublish (pitch: Pitch, userId: string)  {
    const permissions = await this.permissionService.permissionsForUser(userId);
    const hasPublishPermission = permissions.indexOf('pitch:publish') > -1;

    return hasPublishPermission || pitch.ownerId === userId || pitch.userId === userId;
  }

  async publish(where: PitchWhereUniqueInput, userId: string) {
    const pitch = await this.findOne(where);

    const userCanPublish = await this.canPublishUnpublish(pitch, userId);
    if (!userCanPublish) {
      throw new Error(`You can publish only your own pitch.`);
    }

    if (pitch.status === PitchStatus.PUBLISHED) {
      throw new Error(`You can not publish this pitch because it is already PUBLISHED.`);
    }

    return this.update({ status: PitchStatus.PUBLISHED }, where, userId, {
      eventType: 'publish',
    });
  }

  async unpublish(where: PitchWhereUniqueInput, userId: string) {
    const pitch = await this.findOne(where);

    const userCanUnpublish = await this.canPublishUnpublish(pitch, userId);
    if (!userCanUnpublish) {
      throw new Error(`You can unpublish only your own pitch.`);
    }

    if (pitch.status !== PitchStatus.PUBLISHED) {
      throw new Error(
        `You can only unpublish PUBLISHED pitches. This pitch has status = ${pitch.status}`
      );
    }

    return this.update({ status: PitchStatus.ACTIVE }, where, userId, { eventType: 'unpublish' });
  }

  async pitchVideoStats(userId: string) {
    const BLANK_RESPONSE = {
      load_count: 0,
      play_count: 0,
      play_rate: 0,
      hours_watched: 0,
      engagement: 0,
      visitors: 0,
    };

    const pitches = await this.repository.find({
      where: { userId },
      relations: ['pitchVideos', 'pitchVideos.video'],
      order: {
        updatedAt: 'DESC',
      },
    });
    // console.log('pitches :>> ', JSON.stringify(pitches, undefined, 2));

    if (!pitches.length) {
      return BLANK_RESPONSE;
    }
    const pitch = pitches[0];
    // console.log('pitch :>> ', JSON.stringify(pitch, undefined, 2));

    if (!pitch.pitchVideos.length) {
      return BLANK_RESPONSE;
    }

    const pitchVideo = pitch.pitchVideos.sort((a: PitchVideo, b: PitchVideo) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })[0];

    if (!pitchVideo?.video?.wistiaId) {
      return BLANK_RESPONSE;
    }

    // console.log('pitchVideo :>> ', pitchVideo);
    return this.wistiaService.getStats(pitchVideo.video.wistiaId);
  }

  async pitchVideoIframes(userId: string) {
    const BLANK_RESPONSE = [{ url: "" }];

    const pitches = await this.repository.find({
      where: { userId },
      relations: ['pitchVideos', 'pitchVideos.video'],
      order: {
        updatedAt: 'DESC',
      },
    });
    // console.log('pitches :>> ', JSON.stringify(pitches, undefined, 2));

    if (!pitches.length) {
      return BLANK_RESPONSE;
    }
    const pitch = pitches[0];
    // console.log('pitch :>> ', JSON.stringify(pitch, undefined, 2));

    if (!pitch.pitchVideos.length) {
      return BLANK_RESPONSE;
    }

    const pitchVideo = pitch.pitchVideos.sort((a: PitchVideo, b: PitchVideo) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })[0];

    if (!pitchVideo?.video?.wistiaId) {
      return BLANK_RESPONSE;
    }

    // console.log('pitchVideo :>> ', pitchVideo);
    return this.wistiaService.getIframes(pitchVideo.video.wistiaId);
  }
}

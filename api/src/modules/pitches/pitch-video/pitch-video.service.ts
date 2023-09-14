import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService } from 'warthog';
import { VideoService } from '../../core/video/video.service';
import { PitchVideo, PitchVideoStatus } from './pitch-video.model';
import { PitchVideoCreateExtendedInput } from './pitch-video.resolver';

@Service('PitchVideoService')
export class PitchVideoService extends BaseService<PitchVideo> {
  constructor(
    @InjectRepository(PitchVideo) protected readonly repository: Repository<PitchVideo>,
    @Inject('VideoService') public readonly videoService: VideoService
  ) {
    super(PitchVideo, repository);
  }

  @Transaction()
  async createExtended(
    data: PitchVideoCreateExtendedInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchVideo> {
    const manager = options?.manager || transactionManager;

    const { video: videoData, ...pitchVideoInput } = data;

    // Swap the active video to this new video
    const activeVideos = await this.find({
      status: PitchVideoStatus.ACTIVE,
      pitchId: data.pitchId,
      extendedVideo: !!data.extendedVideo
    });

    if (activeVideos.length) {
      const activeVideo = activeVideos[0];
      await this.update({ status: PitchVideoStatus.INACTIVE }, { id: activeVideo.id }, userId, {
        manager,
      });
    }

    const video = await this.videoService.create(videoData, userId, { manager });

    const pitchVideoData: Partial<PitchVideo> = {
      ...pitchVideoInput,
      status: PitchVideoStatus.ACTIVE,
      videoId: video.id,
    };
    const pitchVideo = await super.create(pitchVideoData, userId, { manager });
    return pitchVideo; // Need to wait for promise to resolve for the transaction
  }
}

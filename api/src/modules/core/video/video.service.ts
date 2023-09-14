import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { BaseService, ConfigService, DeepPartial } from '../../../core';
import { FileService } from '../file/file.service';
import { WistiaService } from '../wistia/wistia.service';
import { Video } from './video.model';

@Service('VideoService')
export class VideoService extends BaseService<Video> {
  params: any;

  constructor(
    @InjectRepository(Video) protected readonly repository: Repository<Video>,
    @Inject('ConfigService') public readonly config: ConfigService,
    @Inject('WistiaService') public readonly wistiaService: WistiaService,
    @Inject('FileService') public readonly fileService: FileService
  ) {
    super(Video, repository);
  }

  @Transaction()
  async create(
    data: DeepPartial<Video>,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<Video> {
    // console.log('Video create data :>> ', data);
    const manager = options?.manager || transactionManager;

    const { fileId } = data;

    const wistiaResponse = await this.wistiaService.uploadByUrl(fileId!);

    const file = await this.fileService.create({ url: fileId }, userId, { manager });

    const videoData: Partial<Video> = {
      wistiaId: wistiaResponse.hashed_id,
      fileId: file.id,
    };

    const video = await super.create(videoData, userId, { manager });

    return video;
  }
}

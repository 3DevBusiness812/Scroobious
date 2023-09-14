import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { BaseService, ConfigService } from '../../../core';
import { S3Service } from '../s3/s3.service';
import { File } from './file.model';
import { FileCreateInput, FileCreateSignedURLInput, FileSignedURLResponse } from './file.resolver';

@Service('FileService')
export class FileService extends BaseService<File> {
  params: any;

  constructor(
    @InjectRepository(File) protected readonly repository: Repository<File>,
    @Inject('ConfigService') public readonly config: ConfigService,
    @Inject('S3Service') public readonly s3Service: S3Service
  ) {
    super(File, repository);
  }

  async createUploadSignedUrl({
    fileName,
  }: FileCreateSignedURLInput): Promise<FileSignedURLResponse> {
    return this.s3Service.getSignedUrl(fileName);
  }

  isAWSFile(url: string) {
    return url.match(/^https:\/\/.*amazonaws.*/);
  }

  isUrl(url: string) {
    return url.match(/^https?:\/\//);
  }

  @Transaction()
  async createFile(
    data: FileCreateInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<{ id: string } | undefined> {
    const manager = options?.manager || transactionManager;
    // console.log('data.url :>> ', data.url);

    // If data.url is not an AWS link, return undefined
    // in this instance, the UI likely just passed back the current fileId (reference to the `file` table)
    // we should consider this a no-op
    if (!this.isUrl(data.url)) {
      // console.log('Got an ID :>> ', data.url);
      return undefined;
    }

    if (this.isAWSFile(data.url)) {
      // Ensure the file actually got uploaded to S3
      await this.s3Service.headFile(data.url);
      // console.log('head :>> ', head);
    } else {
      // Otherwise we've just been passed a link on the open web
      // TODO: should we make sure this exists?
    }

    return super.create(data, userId, { manager });
  }
}

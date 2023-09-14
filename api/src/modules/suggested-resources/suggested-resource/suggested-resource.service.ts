import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService } from 'warthog';
import { FileService } from '../../core/file/file.service';
import { SuggestedResource } from './suggested-resource.model';

@Service('SuggestedResourceService')
export class SuggestedResourceService extends BaseService<SuggestedResource> {
  constructor(
    @InjectRepository(SuggestedResource)
    protected readonly repository: Repository<SuggestedResource>,
    @Inject('FileService') public readonly fileService: FileService
  ) {
    super(SuggestedResource, repository);
  }

  @Transaction()
  async update<D extends { logoFileId?: string }, W>(
    data: D,
    where: W,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<SuggestedResource> {
    const manager = options?.manager || transactionManager;

    if (data.logoFileId) {
      const file = await this.fileService.createFile({ url: data.logoFileId }, userId);
      if (file) {
        data = { ...data, logoFileId: file.id };
      }
    }

    const resource = await super.update(data, where, userId, { manager });
    return resource;
  }

  @Transaction()
  async create<D extends { logoFileId: string }>(
    data: D,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<SuggestedResource> {
    const manager = options?.manager || transactionManager;

    const file = await this.fileService.createFile({ url: data.logoFileId }, userId, { manager });
    if (file) {
      data = { ...data, logoFileId: file.id };
    }

    const resource = await super.create(data, userId, { manager });
    return resource;
  }
}

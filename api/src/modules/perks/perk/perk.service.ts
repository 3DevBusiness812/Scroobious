import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, BaseService } from 'warthog';
import { FileService } from '../../core/file/file.service';
import { Perk } from './perk.model';

@Service('PerkService')
export class PerkService extends BaseService<Perk> {
  constructor(
    @InjectRepository(Perk) protected readonly repository: Repository<Perk>,
    @Inject('FileService') public readonly fileService: FileService
  ) {
    super(Perk, repository);
  }

  @Transaction()
  async update<D extends { logoFileId?: string }, W>(
    data: D,
    where: W,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<Perk> {
    const manager = options?.manager || transactionManager;

    if (data.logoFileId) {
      const file = await this.fileService.createFile({ url: data.logoFileId }, userId);
      if (file) {
        data = { ...data, logoFileId: file.id };
      }
    }

    const perk = await super.update(data, where, userId, { manager });
    return perk;
  }

  @Transaction()
  async create<D extends { logoFileId: string }>(
    data: D,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<Perk> {
    const manager = options?.manager || transactionManager;

    const file = await this.fileService.createFile({ url: data.logoFileId }, userId, { manager });
    if (file) {
      data = { ...data, logoFileId: file.id };
    }

    const perk = await super.create(data, userId, { manager });
    return perk;
  }
}

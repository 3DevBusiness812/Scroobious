import { Inject, Service } from 'typedi';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { BaseService } from '../../../core';
import { FileService } from '../../core/file/file.service';
import { PitchDeck, PitchDeckStatus } from './pitch-deck.model';
import { PitchDeckCreateExtendedInput } from './pitch-deck.resolver';

@Service('PitchDeckService')
export class PitchDeckService extends BaseService<PitchDeck> {
  constructor(
    @InjectRepository(PitchDeck) protected readonly repository: Repository<PitchDeck>,
    @Inject('FileService') public readonly fileService: FileService
  ) {
    super(PitchDeck, repository);
  }

  @Transaction()
  async createExtended(
    data: PitchDeckCreateExtendedInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<PitchDeck> {
    const manager = options?.manager || transactionManager;

    const { file: fileData, ...pitchDeckInput } = data;

    // Swap the active deck to to this new deck (only if this wasn't tagged as a draft)
    // Decks will come in as drafts through the PiP when founders ask for written feedback and they shouldn't be shown places until the founder
    // uploads the final deck at the end of the PiP
    if (!data.draft) {
      const activeDecks = await this.find({
        status: PitchDeckStatus.ACTIVE,
        pitchId: data.pitchId,
      });
      if (activeDecks.length) {
        const activeDeck = activeDecks[0];
        await this.update({ status: PitchDeckStatus.INACTIVE }, { id: activeDeck.id }, userId, {
          manager,
        });
      }
    }

    const file = await this.fileService.create(fileData, userId, { manager });

    // Draft pitch decks should never be ACTIVE
    const status = data.draft ? PitchDeckStatus.INACTIVE : PitchDeckStatus.ACTIVE;
    const pitchDeckData: Partial<PitchDeck> = {
      ...pitchDeckInput,
      status,
      fileId: file.id,
    };
    const pitchDeck = await super.create(pitchDeckData, userId, { manager });
    return pitchDeck; // Need to wait for promise to resolve for the transaction
  }
}

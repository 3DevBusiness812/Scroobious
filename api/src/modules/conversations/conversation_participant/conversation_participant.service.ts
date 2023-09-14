import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { ConversationParticipant } from './conversation_participant.model';

@Service('ConversationParticipantService')
export class ConversationParticipantService extends BaseService<ConversationParticipant> {
  constructor(
    @InjectRepository(ConversationParticipant)
    protected readonly repository: Repository<ConversationParticipant>
  ) {
    super(ConversationParticipant, repository);
  }
}

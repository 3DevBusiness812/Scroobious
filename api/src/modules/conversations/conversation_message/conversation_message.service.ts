import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from '../../../core';
import { ConversationMessage } from './conversation_message.model';

@Service('ConversationMessageService')
export class ConversationMessageService extends BaseService<ConversationMessage> {
  constructor(
    @InjectRepository(ConversationMessage)
    protected readonly repository: Repository<ConversationMessage>
  ) {
    super(ConversationMessage, repository);
  }
}

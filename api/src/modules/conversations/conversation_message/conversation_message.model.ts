// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { ManyToOne } from 'typeorm';
import {BaseModel, DateField, IdField, IDType, JSONField, Model, StringField} from 'warthog'
import { User } from '../../identity/user/user.model';
import { Conversation } from '../conversation/conversation.model';

// status (read, unread, opened)
export enum ConversationStatus {
  BOOKMARK = 'BOOKMARK',
  IGNORE = 'IGNORE',
}

// Good reference: https://www.twilio.com/docs/conversations/api/conversation-message-resource
@Model()
export class ConversationMessage extends BaseModel {
  @ManyToOne(
    () => Conversation,
    (conversation: Conversation) => conversation.conversationMessages,
    {
      nullable: false,
    }
  )
  conversation?: Conversation;

  @IdField()
  conversationId!: IDType;

  @ManyToOne(() => User, (user: User) => user.conversationMessages)
  createdBy!: User;

  @StringField({ maxLength: 1600 })
  body!: string;

  @IdField({ nullable: true })
  pitchDeckId!: IDType;

  // this is updated when thread is opened
  @DateField({ nullable: true, editable: false })
  readAt?: Date;

  // @EnumField('ConversationStatus', ConversationStatus, { default: ConversationStatus.BOOKMARK })
  // status!: ConversationStatus;
}

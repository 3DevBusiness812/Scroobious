// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { OneToMany } from 'typeorm';
import { BaseModel, Model, StringField, UpdatedAtField } from 'warthog';
import { ConversationMessage } from '../conversation_message/conversation_message.model';
import { ConversationParticipant } from '../conversation_participant/conversation_participant.model';

// Good reference: https://www.twilio.com/docs/conversations/api/conversation-resource
@Model()
export class Conversation extends BaseModel {
  @StringField({ nullable: true })
  friendlyName?: string;

  @OneToMany(
    () => ConversationParticipant,
    (participant: ConversationParticipant) => participant.conversation
  )
  conversationParticipants!: ConversationParticipant[];

  @OneToMany(() => ConversationMessage, (message: ConversationMessage) => message.conversation)
  conversationMessages!: ConversationMessage[];

  // Need to override defaults to get sorting, filtering, etc...
  @UpdatedAtField({ sort: true })
  declare updatedAt: Date;
}

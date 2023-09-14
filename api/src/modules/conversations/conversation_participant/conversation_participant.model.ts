// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import {BaseModel, BooleanField, DateField, DateTimeString, IdField, IDType, ManyToOne, Model} from 'warthog'
import { User } from '../../identity/user/user.model';
import { Conversation } from '../conversation/conversation.model';

// Good reference: https://www.twilio.com/docs/conversations/api/conversation-participant-resource
// TODO: Unique key on conversation_id + Participant
@Model()
export class ConversationParticipant extends BaseModel {
  @ManyToOne(
    () => Conversation,
    (conversation: Conversation) => conversation.conversationParticipants,
    {
      nullable: false,
    }
  )
  conversation?: Conversation;

  @IdField()
  conversationId!: IDType;

  @ManyToOne(() => User, (user: User) => user.conversationParticipants)
  user!: User;

  @IdField()
  userId!: IDType;

  // @IntField({ nullable: true, editable: false })
  // lastReadIndex?: DateTimeString

  @DateField({ nullable: true, editable: false })
  lastReadAt?: DateTimeString;

  @BooleanField({ filter: ['eq'] })
  messageAnonymously!: boolean;

}

import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext } from 'warthog';
import { UserSafe } from '../../identity/user/user.model';
import { ConversationParticipant } from './conversation_participant.model';
import { ConversationParticipantService } from './conversation_participant.service';

@Resolver(ConversationParticipant)
export class ConversationParticipantResolver {
  // export class ConversationParticipantResolver extends BaseService<ConversationParticipant> {
  constructor(
    @Inject('ConversationParticipantService')
    public readonly conversationParticipantService: ConversationParticipantService
  ) {}

  // TODO: @Permission('conversationParticipant:admin')
  @FieldResolver(() => UserSafe)
  user(
    @Root() conversationParticipant: ConversationParticipant,
    @Ctx() ctx: BaseContext
  ): Promise<ConversationParticipant> {
    return ctx.dataLoader.loaders.ConversationParticipant.user.load(conversationParticipant);
  }
}

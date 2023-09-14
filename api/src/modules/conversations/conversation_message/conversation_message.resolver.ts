import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, UserId } from 'warthog';
import { ConversationMessageCreateInput } from '../../../../generated/classes';
import { UserSafe } from '../../identity/user/user.model';
import { ConversationMessage } from './conversation_message.model';
import { ConversationMessageService } from './conversation_message.service';

@Resolver(ConversationMessage)
export class ConversationMessageResolver {
  // export class ConversationMessageResolver extends BaseService<ConversationMessage> {
  constructor(
    @Inject('ConversationMessageService')
    public readonly conversationMessageService: ConversationMessageService
  ) {}

  // TODO: @Permission('conversationmessage:admin')
  @FieldResolver(() => UserSafe)
  createdBy(
    @Root() conversationMessage: ConversationMessage,
    @Ctx() ctx: BaseContext
  ): Promise<ConversationMessage> {
    return ctx.dataLoader.loaders.ConversationMessage.createdBy.load(conversationMessage);
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => ConversationMessage)
  async createConversationMessage(
    @Arg('data') data: ConversationMessageCreateInput,
    @UserId() userId: string
  ): Promise<ConversationMessage> {
    return this.conversationMessageService.create(data, userId);
  }
}

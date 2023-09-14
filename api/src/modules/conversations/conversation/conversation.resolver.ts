import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Inject } from 'typedi';
import { BaseContext, Fields, StandardDeleteResponse, UserId } from 'warthog';
import {
  ConversationCreateInput,
  ConversationCreateManyArgs,
  ConversationUpdateArgs,
  ConversationWhereArgs,
  ConversationWhereUniqueInput,
} from '../../../../generated';
import { ConversationMessage } from '../conversation_message/conversation_message.model';
import { ConversationParticipant } from '../conversation_participant/conversation_participant.model';
import { Conversation } from './conversation.model';
import { ConversationService } from './conversation.service';

@Resolver(Conversation)
export class ConversationResolver {
  // export class ConversationResolver extends BaseService<Conversation> {
  constructor(
    @Inject('ConversationService') public readonly conversationService: ConversationService
  ) {}

  // TODO: @Permission('conversation:admin')
  @FieldResolver(() => [ConversationMessage])
  conversationMessages(
    @Root() conversation: Conversation,
    @Ctx() ctx: BaseContext
  ): Promise<Conversation> {
    return ctx.dataLoader.loaders.Conversation.conversationMessages.load(conversation);
  }

  // TODO: @Permission('conversation:admin')
  @FieldResolver(() => [ConversationParticipant])
  conversationParticipants(
    @Root() conversation: Conversation,
    @Ctx() ctx: BaseContext
  ): Promise<Conversation> {
    return ctx.dataLoader.loaders.Conversation.conversationParticipants.load(conversation);
  }

  // TODO: @Permission('conversation:admin')
  @Query(() => [Conversation])
  async conversations(
    @Args() { where, orderBy, limit, offset }: ConversationWhereArgs,
    @Fields() fields: string[],
    @UserId() userId: string
  ): Promise<Conversation[]> {
    return this.conversationService.query(where, userId, orderBy, limit, offset, fields);
  }

  // TODO: @Permission('conversation:admin')
  @Query(() => Conversation)
  async conversation(@Arg('where') where: ConversationWhereUniqueInput): Promise<Conversation> {
    return this.conversationService.service.findOne<ConversationWhereUniqueInput>(where);
  }

  // TODO: @Permission('conversation:admin')
  @Query(() => Conversation, { nullable: true })
  async findExistingConversation(
    @Arg('userId1') userId1: string,
    @Arg('userId2') userId2: string
  ): Promise<Conversation | undefined> {
    return this.conversationService.findExistingConversation(userId1, userId2);
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => Conversation)
  async createConversation(
    @Arg('data') data: ConversationCreateInput,
    @UserId() userId: string
  ): Promise<Conversation> {
    return this.conversationService.service.create(data, userId);
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => Conversation)
  async startConversation(
    @Arg('conversationData') conversationData: ConversationCreateInput,
    @Arg('messageBody') messageBody: string,
    @Arg('participantIds', () => [String]) participantIds: string[],

    @UserId() userId: string
  ): Promise<Conversation> {
    return this.conversationService.startConversation(
      conversationData,
      messageBody,
      participantIds,
      userId
    );
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => [Conversation])
  async createManyConversations(
    @Args() { data }: ConversationCreateManyArgs,
    @UserId() userId: string
  ): Promise<Conversation[]> {
    return this.conversationService.service.createMany(data, userId);
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => Conversation)
  async updateConversation(
    @Args() { data, where }: ConversationUpdateArgs,
    @UserId() userId: string
  ): Promise<Conversation> {
    return this.conversationService.service.update(data, where, userId);
  }

  // TODO: @Permission('conversation:admin')
  @Mutation(() => StandardDeleteResponse)
  async deleteConversation(
    @Arg('where') where: ConversationWhereUniqueInput,
    @UserId() userId: string
  ): Promise<StandardDeleteResponse> {
    return this.conversationService.service.delete(where, userId);
  }
}

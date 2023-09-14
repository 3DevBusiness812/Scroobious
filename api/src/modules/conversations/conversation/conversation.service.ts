import { Service } from 'typedi';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions, getContainer } from 'warthog';
import { BaseService } from '../../../core';
import { User } from '../../identity/user/user.model';
import { UserService } from '../../identity/user/user.service';
import { ConversationMessageService } from '../conversation_message/conversation_message.service';
import { ConversationParticipant } from '../conversation_participant/conversation_participant.model';
import { ConversationParticipantService } from '../conversation_participant/conversation_participant.service';
import { Conversation } from './conversation.model';

@Service('ConversationService')
export class ConversationService {
  service: BaseService<Conversation>;
  userService: BaseService<User>;
  participantService: ConversationParticipantService;
  messageService: ConversationMessageService;

  constructor(
    @InjectRepository(Conversation) protected readonly repository: Repository<Conversation>
  ) {
    this.service = new BaseService(Conversation, repository);
    this.userService = getContainer(UserService);
    this.messageService = getContainer(ConversationMessageService);
    this.participantService = getContainer(ConversationParticipantService);
  }

  // TODO: Need to update base service to be able to create nested relationships, too
  async startConversation(
    conversationData: DeepPartial<Conversation>,
    messageBody: string,
    participantIds: string[],
    userId: string, // TODO: need to be able to pull userId from the session in here
    options?: BaseOptions
  ): Promise<Conversation> {
    // TODO: don't allow recreating the same conversation

    const conversation = await this.service.create(conversationData, userId, options);
    const conversationId = conversation.id;

    if (participantIds && participantIds.length) {
      // Make sure the user that sends the message is in the convo
      if (!participantIds.includes(userId)) {
        participantIds.push(userId);
      }

      const participantObjs = participantIds.map(function (participantId: string) {
        return { conversationId, userId: participantId };
        // return { conversation, user: { id: participantId } }; This is what used to be here in case things blow up
      });

      await this.participantService.createMany(participantObjs, userId);

      await this.messageService.create({ conversationId, body: messageBody }, userId);
    }

    return conversation;
  }

  // Note: this only currently works for a conversation between 2 parties,
  //       which should be fine for a while (forever?)
  async findExistingConversation(userId1: string, userId2: string) {
    const result = await this.service.manager.query(
      `
      SELECT conversation_id
      FROM conversation_participant
      WHERE conversation_id IN (
        SELECT conversation_id
        FROM conversation_participant
        WHERE user_id = $1
      )
      AND user_id = $2;
    `,
      [userId1, userId2]
    );

    if (!result || !result.length) {
      return undefined;
    }
    const conversationId = result[0].conversation_id;

    const conversations = await this.messageService.find({ conversationId: conversationId })

    if (!conversations || !conversations.length) {
      await this.participantService.delete({ conversationId: conversationId }, userId1);
      await this.service.delete({ id: conversationId }, userId1);
      return undefined;
    }

    return this.service.findOne({ id: conversationId });
  }

  async query(
    where: any = {}, // TODO: fix any
    userId: string,
    orderBy?: string,
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Conversation[]> {
    // console.log(`this.service.klass`, this.service.klass);

    const myWorld = await this.myWorldFilter(userId);

    where = {
      ...where,
      ...myWorld,
    };

    return (
      this.service
        .buildFindQuery(where, orderBy, { limit: limit || 20, offset: offset }, fields)

        // .innerJoinAndSelect(
        //   // You need to add double quotes around the alias name for some reason
        //   // See: https://github.com/typeorm/typeorm/issues/4069
        //   `conversation.participants`,
        //   'participant',
        //   'participant.user_id = :userId',
        //   {
        //     userId,
        //   }
        // )
        .getMany()
    );
  }

  async myWorldFilter(userId: string) {
    const participants = await this.participantService.find({ userId });
    // console.log(`participants`, participants);

    let conversationIds: string[] = participants.map((participant: ConversationParticipant) => {
      return participant.conversationId;
    });

    if (!conversationIds.length) {
      conversationIds = ['EMPTY'];
    }
    // console.log(`conversationIds`, conversationIds);

    return {
      id_in: conversationIds,
    };
  }

  applyMyWorld(qb: SelectQueryBuilder<Conversation>, userId: string) {
    // TODO: likely different for admins

    qb = qb.innerJoinAndSelect(
      // You need to add double quotes around the alias name for some reason
      // See: https://github.com/typeorm/typeorm/issues/4069
      `${qb.alias}.participants`,
      'participant',
      'participant.user_id = :userId',
      {
        userId,
      }
    );

    return qb;
  }
}

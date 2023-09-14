import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { ConversationMessage } from './conversation_message.model';

const queue: BatchJob<ConversationMessage> = {
  name: 'conversation_message.create',
  process,
};

async function process({
  data,
  config,
  debug,
  binding,
  notifier,
}: JobProcessorOptions<ConversationMessage>): Promise<void> {
  const conversation = await binding.query.conversation(
    { where: { id: data.conversationId } },
    `{
      id
      conversationParticipants {
        id
        userId
        user {
          email
        }
      }
    }`
  );
  debug('conversation :>> ', conversation);
  if (!data.createdById) {
    throw new Error('Expected data.createdById');
  }

  const sender = await binding.query.user({ where: { id: data.createdById } });
  // console.log('sender :>> ', sender);

  const notMeParticipants = conversation.conversationParticipants.filter(
    (part) => part.userId !== data.createdById
  );
  const notMe = notMeParticipants[0];
  if (!notMe.user) {
    throw new Error("Couldn't find user to send email to");
  }
  debug('receiver :>> ', notMe.user);

  const conversationUrl = config.getWebUrl(`/messages/${data.conversationId}`);
  debug('conversationUrl :>> ', conversationUrl);

  return notifier.sendEmailFromTemplate({
    to: notMe.user.email,
    templateId: '7',
    data: {
      body: data.body,
      conversationUrl,
      sender: {
        name: sender.name,
      },
    },
  });
}

export default queue;

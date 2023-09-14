import { Conversation, ConversationParticipant, User } from '@binding'
import { DateFormatter } from '@core/date'

export class ConversationPresenter {
  conversations: Conversation[]

  loggedInUser: User

  constructor(conversations: Conversation[], me: User) {
    this.conversations = conversations
    this.loggedInUser = me
  }

  formatted() {
    return this.conversations
      .map((conv) => {
        const lastMessage = conv.conversationMessages && conv.conversationMessages[conv.conversationMessages.length - 1]

        const notMe = this.getCoversationOtherSideUser(conv)

        return {
          ...conv,
          createdAtShort: lastMessage && DateFormatter.format(lastMessage!.createdAt.toString(), 'MMM D'),
          timeSinceMessage: lastMessage && DateFormatter.timeAgo(lastMessage!.createdAt),
          senderPictureUrl: notMe!.profilePictureFile.url,
          notMe,
          lastMessage,
        }
      })
      .filter((conv) => conv.lastMessage)
  }

  getCoversationOtherSideUser(conversation: Conversation) {
    const participants = conversation.conversationParticipants.filter(
      (part: ConversationParticipant) => part && part.user!.id !== this.loggedInUser.id,
    )
    return participants[0].user
  }
}

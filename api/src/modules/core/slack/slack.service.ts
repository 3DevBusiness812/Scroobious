// https://api.slack.com/messaging/retrieving
import axios from 'axios';
// @ts-ignore (slack-hawk-down doesn't have typings)
import { escapeForSlackWithMarkdown } from 'slack-hawk-down';
import { Inject, Service } from 'typedi';
import { ConfigService, getContainer } from '../../../core';

const SLACK_CONVERSATION_HISTORY_PAYLOAD = {
  data: {},
};

@Service('SlackService')
export class SlackService {
  testMode: boolean;
  params: any;

  constructor(@Inject('ConfigService') public readonly config: ConfigService) {
    this.testMode = process.env.NODE_ENV === 'test';

    if (!this.config.get('SLACK_BOT_TOKEN')) {
      throw new Error('Slack token not found');
    }

    return this;
  }

  getSlackUrl(endpoint: string, queryString: string) {
    const url = `https://slack.com/api/${endpoint}?${queryString}`;
    // console.log('url :>> ', url);
    return url;
  }

  async conversationHistory(channelId?: string) {
    // NOTE: this is an anti-pattern.  I'm mocking this service out for tests by checking
    // to see if we're in test mode here.  We should actually use dependency injection in the
    // tests, but... time.
    if (this.testMode) {
      return SLACK_CONVERSATION_HISTORY_PAYLOAD.data;
    }

    // #scroobious-official
    const SCROOBIOUS_OFFICIAL_CHANNEL_ID = 'C01G95ERV1N';
    const channel = channelId ?? SCROOBIOUS_OFFICIAL_CHANNEL_ID;

    const res: any = await axios.get(
      this.getSlackUrl('conversations.history', `channel=${channel}&limit=5`),
      {
        headers: {
          Authorization: 'Bearer ' + process.env.SLACK_BOT_TOKEN,
        },
      }
    );

    // console.log('res.data :>> ', res.data);   

    const messages = res.data.messages.map((message: any) => {
      return {
        ...message,
        html: escapeForSlackWithMarkdown(message.text),
      };
    });

    return {
      ...res.data,
      messages,
    };
  }
}

// For running directly with ts-node
if (require.main === module) {
  const service = getContainer(SlackService);

  service
    .conversationHistory()
    .then((result) => {
      // console.log('result :>> ', result);
      // console.log('result.messages.length :>> ', result.messages.length);
      // console.log('formatted', result.messages);
    })
    .catch((error: Error) => {
      console.error(error);
    })
    .finally(process.exit);
}

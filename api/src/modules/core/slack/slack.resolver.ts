import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { SlackService } from './slack.service';

@ObjectType()
export class SlackMessage {
  @Field({ nullable: false })
  text!: string;

  @Field({ nullable: false })
  html!: string;

  @Field({ nullable: false })
  ts!: string;
}

@ObjectType()
export class SlackCommunityChannelHistoryResponse {
  @Field(() => [SlackMessage], { nullable: false })
  messages!: SlackMessage[];
}

@Resolver()
export class SlackResolver {
  constructor(@Inject('SlackService') public readonly service: SlackService) {}

  @Query(() => SlackCommunityChannelHistoryResponse)
  async slacks(): Promise<SlackCommunityChannelHistoryResponse> {
    const slacks = await this.service.conversationHistory();
    // console.log('slacks :>> ', slacks);
    return slacks;
  }
}

import { Connection } from 'typeorm';
import { getContainer } from '../src/core/di';
import { getDBConnection } from '../src/db/connection';
import { ConversationService } from '../src/modules/conversations/conversation/conversation.service';
import { ConversationMessageService } from '../src/modules/conversations/conversation_message/conversation_message.service';
import { ListService } from '../src/modules/core/list/list.service';
import { UserService } from '../src/modules/identity/user/user.service';
import {
  createAdmin,
  createAllison,
  createFounder,
  createInvestor,
  createPerks,
  createResources,
  createReviewer,
} from './helpers';
import { seedSubscriptions } from './subscriptions';
import { writeM2MToken } from './token';

const NUM_RECORDS = 1;

export const seed = async (connection: Connection) => {
  await getDBConnection();

  const userService = getContainer(UserService);
  const listService = getContainer(ListService);

  const conversationService = getContainer(ConversationService);
  const messageService = getContainer(ConversationMessageService);

  const lists = await listService.find({
    listName_in: ['industry', 'funding_status', 'company_stage', 'state_province', 'revenue'],
  });

  function getListValueArray(listName: string) {
    const listItems = lists.find((list) => list.name === listName)?.items;
    if (!listItems) {
      return [];
    }

    return listItems.map((item) => item.id);
  }

  // This admin was already created in previous migration
  const systemAdmin = await userService.findOne({ email_eq: process.env.SCROOBIOUS_ADMIN_EMAIL });

  await createPerks();
  await createResources();

  for (let index = 0; index < NUM_RECORDS; index++) {
    await createFounder();
  }

  const allisonResponse = await createAllison();

  if (!allisonResponse) {
    return;
  }

  const investor = await createInvestor({ pitchId: allisonResponse.pitch.id });
  const allison = allisonResponse.user;

  await createAdmin();
  await createReviewer();

  let initialMessageBody = 'Hey, whats up... long time';
  const conversation = await conversationService.startConversation(
    {},
    initialMessageBody,
    [systemAdmin.id],
    allison.id
  );
  await messageService.create(
    { conversation, body: 'Right?  Good hearing from you.' },
    systemAdmin.id
  );

  initialMessageBody =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel laoreet orci, pulvinar lacinia risus. Morbi egestas mollis nisi non ullamcorper. Aenean placerat nec est ac iaculis.';
  const conversation2 = await conversationService.startConversation(
    {},
    initialMessageBody,
    [systemAdmin.id],
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Cras a tortor ut turpis imperdiet maximus. Vestibulum blandit nisi dolor, ac fermentum magna rhoncus eget. Sed luctus, enim eu egestas convallis, nibh nunc sodales lacus, vitae pretium purus sem sit amet odio. Etiam interdum a leo id fringilla. Cras venenatis turpis diam, ac fermentum massa cursus in. Quisque fermentum nisl eget nisi tristique, a finibus tortor cursus.',
    },
    systemAdmin.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Nunc in lectus non purus consectetur molestie id id nisl. Integer maximus semper eros at sollicitudin. Duis consequat nisl ut odio ullamcorper, tincidunt malesuada nisi facilisis.  Aenean tincidunt cursus ex vel pulvinar. Curabitur dictum congue pellentesque. Phasellus pharetra consequat urna sed ultricies. Phasellus tristique neque velit, nec feugiat elit eleifend non. Pellentesque a volutpat sem. Nunc ultrices urna in lectus pretium porta. Pellentesque et vestibulum ex.',
    },
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Vivamus volutpat nulla nunc, ac condimentum lacus ultricies vitae. Vestibulum interdum mauris ut sapien lacinia, et convallis nisl pulvinar. Suspendisse a enim magna. Sed at justo fringilla lectus fermentum auctor. Sed et enim sapien. Sed condimentum nisi hendrerit gravida vestibulum. Nulla laoreet quam ac augue blandit bibendum.',
    },
    systemAdmin.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; ',
    },
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Maecenas sed urna dictum, auctor urna ac, pulvinar dui. Suspendisse est lectus, hendrerit quis sagittis in, volutpat non eros. Morbi tincidunt vel massa et pretium. Etiam non lorem vestibulum, commodo libero et, dignissim ante. ',
    },
    systemAdmin.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Donec placerat erat sed maximus ultrices. Morbi ornare et mi quis congue. Nunc quis risus mauris. Curabitur sit amet ornare metus. Vestibulum interdum vestibulum vehicula. Sed rutrum neque ut vestibulum pellentesque. Vivamus est risus, tempus finibus accumsan et, hendrerit ut ante. Donec sit amet sem enim. Ut vel est et quam vulputate bibendum. Proin libero velit, congue a facilisis vitae, tristique a dolor.',
    },
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Nullam ex sapien, malesuada sed sapien et, ultrices lobortis sem.',
    },
    systemAdmin.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Cras sollicitudin lobortis semper. Fusce luctus gravida massa blandit tincidunt. Morbi pulvinar diam arcu, eget gravida ex faucibus sit amet.',
    },
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Donec congue dui metus, ut condimentum dui congue at. Fusce bibendum tortor in mattis tempus.',
    },
    systemAdmin.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Vestibulum nec neque lacus. Pellentesque ac enim nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum in ipsum risus. Praesent augue diam, vehicula at tempus vel, varius sit amet quam. Vestibulum ut nunc lobortis, sagittis dolor ut, dignissim magna.',
    },
    investor.id
  );

  await messageService.create(
    {
      conversation: conversation2,
      body: 'Vivamus et mi in est suscipit hendrerit id non neque. In tristique nulla quis ex semper, eu vestibulum mauris imperdiet. Aliquam condimentum nisi sed elementum lobortis. Morbi tempus mollis arcu at tincidunt. Donec at iaculis justo. Aliquam aliquet rhoncus ligula, vitae rhoncus risus vulputate ut. Aenean tellus orci, accumsan sit amet mauris eu, tempor porttitor enim. Vestibulum nunc eros, tristique sed erat eget, blandit feugiat risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque pharetra magna ac porttitor luctus. Maecenas tempus metus lectus, at vulputate est ultricies at. Fusce mollis odio libero, vitae egestas sem rutrum in. Cras mollis ligula nec condimentum lacinia. Mauris vel ligula diam. Nullam lacinia est non tortor suscipit, ut convallis augue vestibulum.',
    },
    systemAdmin.id
  );

  await seedSubscriptions({ userId: systemAdmin.id });

  if (process.env.NODE_ENV === 'development') {
    await writeM2MToken({
      ...systemAdmin,
      password: process.env.SCROOBIOUS_ADMIN_DB_PASSWORD!,
    });
  }
};

// For running directly with ts-node
if (require.main === module) {
  seed(null as any)
    .then((result) => console.log(result))
    .catch((error) => console.error(error))
    .finally(process.exit);
}

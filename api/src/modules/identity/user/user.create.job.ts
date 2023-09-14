import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { CustomerIoUser } from '../../core/notifications/notification.service';
import { User } from './user.model';

const queue: BatchJob<User> = {
  name: 'user.create',
  process,
};

async function process({
  debug,
  data,
  binding,
  notifier,
}: JobProcessorOptions<User>): Promise<void> {
  debug(`processing user: ${data.email}`);

  const user = await binding.query.user(
    { where: { id: data.id } },
    `{
      id
      status
      email
      profilePictureFile {
        id
        url
      }
      name
      firstName
      isAccredited
      migratedFromBubble
      capabilities
      createdAt
      lastLoginAt
    }`
  );
  debug('user :>> ', user);
  if (!user) {
    throw new Error('Expected user to be found');
  }

  const { profilePictureFile, ...rest } = user;
  const identifyUser: CustomerIoUser = {
    ...rest,
    image: profilePictureFile?.url,
    cio_subscription_preferences: {
      topics: {
         topic_9: true,
         topic_13: true
      }
   }
  };

  debug(`Creating user in Customer.io: ${data.email}`);
  return notifier.identify(identifyUser);
}

export default queue;

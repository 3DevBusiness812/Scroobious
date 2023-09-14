import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { Startup } from './startup.model';

const queue: BatchJob<Startup> = {
  name: 'startup.update',
  process,
};

async function process({
  debug,
  data,
  binding,
  notifier,
}: JobProcessorOptions<Startup>): Promise<void> {
  debug(`processing startup update: ${data.id}`);

  const startup = await binding.query.startup(
    { where: { id: data.id } },
    `{
      stateProvince
      industries
      organization {
        user {
          email
        }
      }
    }`
  );
  debug('startup :>> ', startup);
  if (!startup) {
    throw new Error('Expected startup to be found');
  }

  const { organization, ...rest } = startup;
  const identifyUser: any = {
    email: organization.user.email,
    ...rest,
  };

  debug(`Updating user from startup in Customer.io: ${organization.user.email}`);
  return notifier.identify(identifyUser);
}

export default queue;

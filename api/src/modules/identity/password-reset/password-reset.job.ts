import { getContainer } from 'warthog';
import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { PasswordReset } from './password-reset.model';
import { PasswordResetService } from './password-reset.service';

const queue: BatchJob<PasswordReset> = {
  name: 'password_reset.create',
  process,
};

async function process({
  debug,
  data,
  notifier,
}: JobProcessorOptions<PasswordReset>): Promise<void> {
  debug(`processing password reset: ${data.email}`);

  const service = getContainer(PasswordResetService);
  const url = service.passwordResetLink(data.token);
  // console.log('url :>> ', url);

  return notifier.sendEmailFromTemplate({
    to: data.email,
    templateId: '6',
    data: {
      url,
    },
  });
}

export default queue;

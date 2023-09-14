import { APIClient, RegionUS, SendEmailRequest, TrackClient } from 'customerio-node';
import { Inject, Service } from 'typedi';
import { getContainer, StringMap } from 'warthog';
import { ConfigService, loadConfig, Logger, toUnixSeconds } from '../../../core';
import { getDBConnection } from '../../../db/connection';
import { UserService } from '../../identity/user/user.service';

interface EmailFromTemplate<D> {
  to: string;
  templateId: string;
  data: D;
}

export interface CustomerIoUser {
  email: string;
  image?: any;
  createdAt?: Date | string;
  cio_subscription_preferences?: any;
  pitchPublished?: boolean;
}
@Service('NotificationService')
export class NotificationService {
  inTestENV: boolean;
  emailClient: APIClient;
  cio: TrackClient;

  constructor(
    @Inject('ConfigService') public readonly config: ConfigService,
    @Inject('UserService') public readonly userService: UserService,
    @Inject('Logger') public readonly logger: Logger
  ) {
    this.inTestENV = process.env.JEST_WORKER_ID !== undefined;

    this.emailClient = new APIClient(this.config.get('CUSTOMERIO_API_KEY'));
    this.cio = new TrackClient(
      this.config.get('CUSTOMERIO_TRACKING_SITE_ID'),
      this.config.get('CUSTOMERIO_TRACKING_API_KEY'),
      { region: RegionUS }
    );
  }

  sendEmailFromTemplate<D>({ to, templateId, data }: EmailFromTemplate<D>) {
    if (this.inTestENV) {
      throw new Error('Attempted to send email in tests.  Mock this out!');
    }

    const request = new SendEmailRequest({
      to,
      transactional_message_id: templateId, // Template ID on customer.io
      message_data: data,
      identifiers: {
        email: to,
      },
      from: 'no-reply@scroobious.com', // TODO: should be an ENV var?
    });

    this.logger.info(`Sending email to ${to}`, data);

    return this.emailClient
      .sendEmail(request)
      .then((res) => console.log(res))
      .catch((err) => console.log(err.statusCode, err.message));
  }

  async trackUser(userId: string, event: string, data?: StringMap) {
    const { email } = await this.userService.findOne({ id: userId });
    // console.log('email :>> ', email);
    return this.track(email, event, data);
  }

  // track(customerId: string | number, data?: RequestData): Promise<Record<string, any>>;
  async track(email: string, event: string, data?: StringMap) {
    if (email.indexOf('@') === -1) {
      // Because the users in customer.io come from a variety of services, we always need to call track
      // with the email address, because that's the only thing we can confidently rely on since the ID
      // in customer.io could have come from another source
      throw new Error('You must call track with an email address');
    }

    if (this.inTestENV) {
      throw new Error("Attempted to track in customer.io from tests.  Mock this out!'");
    }

    this.logger.info(`Customer.io tracking event [${event}] for ${email}`, data);

    return this.cio
      .track(email, {
        name: event,
        data,
      })
      .then(() => void 0)
      .catch((err) =>
        this.logger.error(`Customer.io error sending tracking event: ${err.message}`, data)
      );
  }

  async identify(user: CustomerIoUser) {
    if (this.inTestENV) {
      throw new Error("Attempted to identify user in customer.io from tests.  Mock this out!'");
    }

    const { email, createdAt, ...rest } = user;
    const attributes: any = {
      ...rest,
    };

    if (!email) {
      return this.logger.error(`Customer.io identify request failed - no email found`, user);
    }

    // Customer.io requires unix seconds: https://customer.io/docs/faq-timestamps/
    if (createdAt) {
      attributes.created_at = toUnixSeconds(createdAt);
    }

    this.logger.info(`Customer.io identify request for ${email}`, attributes);

    return this.cio
      .identify(email, attributes)
      .then(() => void 0)
      .catch((err) => {
        this.logger.error(`Customer.io error identifying user: ${err.message}`, user);
      });
  }
}

// For running directly with ts-node
if (require.main === module) {
  loadConfig()
    .then(getDBConnection)
    // .then(() => {
    //   const service = getContainer(NotificationService);
    //   return service.sendEmailFromTemplate({
    //     to: 'goldcaddy77@gmail.com',
    //     templateId: '2',
    //     data: {
    //       body: 'hey man how are you?',
    //       conversationId: '1234',
    //       sender: {
    //         name: 'John doe',
    //       },
    //     },
    //   });
    // })

    .then(() => {
      const service = getContainer(NotificationService);
      return service.trackUser('1614304246334x830049626532974500', 'user.update');
    })

    .then((result) => {
      console.log(result);
    })
    .catch((error: Error) => {
      console.error(error);
    })
    .finally(process.exit);
}

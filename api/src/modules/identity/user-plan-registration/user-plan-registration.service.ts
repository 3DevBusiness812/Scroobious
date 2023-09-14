import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseService } from 'warthog';
import { UserPlanRegistration, UserPlanRegistrationStatus } from './user-plan-registration.model';

@Service('UserPlanRegistrationService')
export class UserPlanRegistrationService extends BaseService<UserPlanRegistration> {
  constructor(
    @InjectRepository(UserPlanRegistration)
    protected readonly repository: Repository<UserPlanRegistration>
  ) {
    super(UserPlanRegistration, repository);
  }

  // Returns the Stripe customer ID
  async claim(email: string) {
    // In Development, Test and sometimes in Staging we need to skip registration checks
    const stagingTest = true;
    if (String(process.env.SKIP_USER_REGISTRATION_CHECKS) === 'true' || stagingTest) {
      return 'cus_FakeStripeCustomerId';
    }

    const registrations = await this.find({
      status_eq: UserPlanRegistrationStatus.INPROGRESS,
      email_eq: email,
    });
    const registration = registrations[0];

    if (!registrations || !registration) {
      throw new Error(`Cannot find registration for ${email}.  Have you signed up?`);
    }

    await this.update(
      { status: UserPlanRegistrationStatus.COMPLETED },
      { id: registration.id },
      '1'
    );
    // console.log('registration.raw :>> ', registration.raw);

    return registration.raw.customer as string;
  }
}

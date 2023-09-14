import {
  BaseModel,
  EnumField,
  IdField,
  IDType,
  JSONField,
  JsonObject,
  ManyToOne,
  Model,
  StringField,
} from 'warthog';
import { User } from '../user/user.model';

export enum UserPlanRegistrationStatus {
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Model()
export class UserPlanRegistration extends BaseModel {
  @StringField()
  email!: string;

  @StringField()
  fullName!: string;

  @StringField()
  stripeSubscriptionId!: string;

  @StringField()
  stripePlanId!: string;

  @StringField()
  userType!: string;

  @JSONField()
  raw!: JsonObject;

  @EnumField('UserPlanRegistrationStatus', UserPlanRegistrationStatus, {
    filter: ['eq'],
    computed: true,
    default: UserPlanRegistrationStatus.INPROGRESS,
  })
  status!: UserPlanRegistrationStatus;

  @ManyToOne(() => User, 'UserPlanRegistration')
  user?: User;

  @IdField({ computed: true })
  userId!: IDType;
}

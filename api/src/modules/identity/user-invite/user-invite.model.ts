import { IsEmail, IsIn } from 'class-validator';
import { BaseModel, DateField, EnumField, Model, StringField } from 'warthog';

export enum UserInviteStatus {
  OPEN = 'OPEN',
  ACCEPTED = 'ACCEPTED',
}

@Model()
export class UserInvite extends BaseModel {
  @EnumField('UserInviteStatus', UserInviteStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: UserInviteStatus.OPEN,
  })
  status!: UserInviteStatus;

  @IsEmail()
  @StringField({ filter: ['eq'] })
  email!: string;

  // TODO: We should really pull this dynamically
  @IsIn(['SYSTEM_ADMIN', 'ADMIN', 'REVIEWER'])
  @StringField()
  userType!: string;

  @DateField({ computed: true, nullable: true })
  expiresAt?: Date;

  // TODO: at some point we should make user supply a code for security purposes
}

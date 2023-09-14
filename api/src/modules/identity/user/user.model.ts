// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { ArrayUnique, IsEnum, MinLength } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { BeforeInsert, BeforeUpdate, JoinColumn, OneToMany } from 'typeorm';
import {
  BaseModel,
  BooleanField,
  DateField,
  DateTimeField,
  DateTimeString,
  EmailField,
  EnumField,
  IdField,
  IDType,
  Model,
  OneToOne,
  StringField,
} from 'warthog';
import { getContainer } from '../../../core';
import { ConversationMessage } from '../../conversations/conversation_message/conversation_message.model';
import { ConversationParticipant } from '../../conversations/conversation_participant/conversation_participant.model';
import { ExternalSystemId } from '../../core/external-system-id/external-system-id.model';
import { File } from '../../core/file/file.model';
import { FounderProfile } from '../../founder/founder-profile/founder-profile.model';
import { UserPlanRegistration } from '../../identity/user-plan-registration/user-plan-registration.model';
import { InvestorProfile } from '../../investor/investor-profile/investor-profile.model';
import { PitchComment } from '../../pitches/pitch-comment/pitch-comment.model';
import { PitchUpdate } from '../../pitches/pitch-update/pitch-update.model';
import { PitchUserStatus } from '../../pitches/pitch-user-status/pitch-user-status.model';
import { Pitch } from '../../pitches/pitch/pitch.model';
// import { OneToMany } from 'warthog';
// import { UserRole } from './user-role/user-role.model';
import { Plan } from '../../plan/plan.model';
import { AuthenticationService } from '../auth/auth.service';
import { Organization } from '../organization/organization.model';

export enum UserStatus {
  VERIFICATION = 'VERIFICATION',
  ONBOARDING = 'ONBOARDING',
  ONBOARDING_STARTUP = 'ONBOARDING_STARTUP',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum UserCapability {
  FOUNDER_LITE = 'FOUNDER_LITE',
  FOUNDER_MEDIUM = 'FOUNDER_MEDIUM',
  FOUNDER_FULL = 'FOUNDER_FULL',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
  REVIEWER = 'REVIEWER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  INACTIVE = 'INACTIVE'
}

@ObjectType()
export class UserSafe {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  firstName!: string;

  @Field(() => File, { nullable: false })
  profilePictureFile!: File;
}

@Model()
export class User extends BaseModel {
  @EnumField('UserStatus', UserStatus, {
    filter: ['eq'],
    computed: true,
    default: UserStatus.INACTIVE,
  })
  status!: UserStatus;

  @StringField({ filter: ['contains'] })
  name!: string;

  @EmailField({ unique: true, filter: ['eq'] })
  email!: string;

  @DateTimeField({ computed: true, nullable: true })
  emailVerified?: DateTimeString;

  @OneToOne(() => File, 'profilePicture')
  @JoinColumn()
  profilePictureFile!: File;

  @IdField()
  profilePictureFileId!: IDType;

  @StringField({ nullable: true })
  stripeUserId?: string;

  @BooleanField({ default: false, filter: ['eq'], nullable: true })
  isAccredited!: boolean;

  @BooleanField({ filter: ['eq'], nullable: true, default: false })
  migratedFromBubble?: boolean;

  @OneToMany(() => Organization, 'user')
  organizations!: Organization[];

  @OneToMany(() => ExternalSystemId, 'user')
  externalSystemIds?: ExternalSystemId[];

  @OneToMany(() => ConversationParticipant, 'user')
  conversationParticipants!: ConversationParticipant[];

  @OneToMany(() => ConversationMessage, 'createdBy')
  conversationMessages!: ConversationMessage[];

  @OneToMany(() => PitchUserStatus, 'user')
  pitchUserStatuses!: PitchUserStatus[];

  @OneToMany(() => PitchUpdate, 'createdBy')
  pitchUpdates!: PitchUpdate[];

  @OneToMany(() => PitchComment, 'createdBy')
  pitchComments!: PitchComment[];

  @Field((type) => [Pitch], { nullable: true })
  @OneToMany(() => Pitch, (pitches) => pitches.user, { lazy: true })
  pitches!: Pitch[];

  @ArrayUnique()
  @IsEnum(UserCapability, { each: true })
  @StringField({ array: true, computed: true })
  capabilities!: string[];

  @OneToOne(() => InvestorProfile, 'user')
  investorProfile!: InvestorProfile;

  @OneToOne(() => FounderProfile, 'user')
  founderProfile!: FounderProfile;

  @OneToMany(() => UserPlanRegistration, 'user')
  userPlanRegistrations?: UserPlanRegistration[];

  @OneToMany(() => Plan, 'user')
  plans?: Plan[];

  // @OneToMany(() => UserRole, (userRole: UserRole) => userRole.user)
  // userRoles?: UserRole[];

  @MinLength(8)
  @StringField({ writeonly: true, nullable: true })
  password!: string;

  @DateField({ nullable: true, computed: true, sort: true })
  lastLoginAt?: Date;

  @StringField({ computed: true, nullable: true })
  firstName?: string;

  // Needed for emails
  // We're not capturing first and last name separately, so we'll pop off the first word of the name and store it away
  @BeforeInsert()
  @BeforeUpdate()
  async setFirstName() {
    if (this.name) {
      const parts = this.name.split(' ');
      this.firstName = parts[0];
    }
  }

  // Emails are case insensitive
  @BeforeInsert()
  @BeforeUpdate()
  setEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const authService: AuthenticationService = getContainer(AuthenticationService);
      this.password = await authService.hash(this.password);
    }
  }
}

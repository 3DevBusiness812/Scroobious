// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
// import { Unique } from 'typeorm';
import { BaseModel, BooleanField, EnumField, Model, StringField } from 'warthog';

export enum SubscriptionType {
  WEBHOOK = 'WEBHOOK',
  JOB = 'JOB',
}

@Model()
// @Unique(['eventTypeId', 'url', 'deletedAt'])
export class Subscription extends BaseModel {
  @StringField()
  eventTypeId!: string;

  @EnumField('SubscriptionType', SubscriptionType)
  type!: SubscriptionType;

  @StringField({ filter: ['eq'], nullable: true })
  url!: string;

  // Should this be "jobSuffix", where we always prepend the eventTypeId to the name of the job for consistency?
  @StringField({ filter: ['eq'], nullable: true })
  jobId!: string;

  @BooleanField({ nullable: true, default: true })
  active?: boolean;

  // TODO: add HTTP method?
  // Will do POST 99% of time likely
}

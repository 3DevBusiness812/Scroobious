// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import {
  CreatedAtField,
  CreatedByField,
  EnumField,
  IdField,
  IdModel,
  IDType,
  JSONField,
  JsonObject,
  Model,
  StringField,
} from 'warthog';

export enum EventStatus {
  NEW = 'NEW',
  PROCESSED = 'PROCESSED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
}

// TODO: should not have deleted fields, updated by or version
@Model()
export class Event extends IdModel {
  // Must line up with event_type.id (or type?)
  // Must be lowercase.lowercase
  @StringField()
  type!: string;

  @EnumField('EventStatus', EventStatus, {
    filter: ['eq'],
    default: EventStatus.NEW,
  })
  status!: EventStatus;

  @StringField({ nullable: true })
  statusMessage?: string;

  @StringField()
  objectType!: string;

  @IdField()
  objectId!: string;

  @StringField()
  ownerId!: string;

  @JSONField({ nullable: true })
  payload?: JsonObject;

  @CreatedAtField()
  createdAt!: Date;

  @CreatedByField()
  declare createdById: IDType;
}

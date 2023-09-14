// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { randomBytes } from 'crypto';
import { BeforeInsert } from 'typeorm';
import {
  BaseModel,
  DateTimeField,
  DateTimeString,
  IdField,
  IDType,
  Model,
  StringField,
} from 'warthog';

// NextAuth
@Model()
export class Session extends BaseModel {
  // TODO: Add index
  @IdField()
  userId!: IDType;

  // The date the session expires (is updated when a session is active)
  @DateTimeField()
  expires!: DateTimeString;

  // The sessionToken should never be exposed to client side JavaScript
  @StringField({ unique: true, filter: ['eq'] })
  sessionToken?: string;

  @BeforeInsert()
  setSessionToken() {
    this.sessionToken = this.sessionToken ?? randomBytes(32).toString('hex');
  }

  // The accessToken can be safely exposed to client side JavaScript to
  // to identify the owner of a session without exposing the sessionToken
  @StringField({ unique: true })
  accessToken?: string;

  @BeforeInsert()
  setAccessToken() {
    this.accessToken = this.accessToken ?? randomBytes(32).toString('hex');
  }
}

// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { BaseModel, DateTimeField, DateTimeString, Model, StringField } from 'warthog';

// TODO: change to verification_tokens
@Model()
export class VerificationRequest extends BaseModel {
  // An email address, phone number, username or other unique identifier
  // associated with the request (used to track who it was on behalf of)
  @StringField()
  identifier!: string;

  // The token used verify the request (maybe hashed or encrypted)
  @StringField({ unique: true })
  token!: string;

  // The date the session expires (is updated when a session is active)
  @DateTimeField()
  expires!: DateTimeString;

  // TODO: might need these for provider.sendVerificationRequest
  // @StringField()
  // url!: string;

  // @StringField()
  // baseUrl!: string;

  // @StringField()
  // provider!: string;
}

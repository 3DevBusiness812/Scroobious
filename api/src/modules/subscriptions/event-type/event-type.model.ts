// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { BaseModel, BooleanField, Model, StringField } from 'warthog';

@Model()
export class EventType extends BaseModel {
  @StringField({ unique: true })
  name!: string;

  @StringField({ nullable: true })
  template?: string;

  // Should we publish these events
  @BooleanField({ default: true })
  allowSubscription?: boolean;
}

// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Matches } from 'class-validator';
import { BaseModel, Model, OneToOne, StringField } from 'warthog';
import { User } from '../../identity/user/user.model';

@Model()
export class FounderProfile extends BaseModel {
  @OneToOne(() => User, 'founderProfile')
  user!: User;

  @StringField({ computed: true, unique: true })
  userId!: string;

  @StringField()
  stateProvince!: string;

  // Blank or https://twitter.com/<handle>
  @Matches(/^$|^https:\/\/(www.)?twitter.com\/.+/, {
    message: 'URL must match https://www.twitter.com/<handle>',
  })
  @StringField({ nullable: true })
  twitterUrl!: string;

  @Matches(/^https:\/\/(www.)?linkedin.com\/in\/.+/, {
    message: 'URL must match https://www.linkedin.com/in/<handle>',
  })
  @StringField({ nullable: true })
  linkedinUrl!: string;

  @StringField({ nullable: true, array: true })
  ethnicities?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true })
  gender!: string;

  @StringField({ nullable: true })
  sexualOrientation!: string;

  @StringField({ nullable: true })
  companyStage!: string;

  @StringField({ nullable: true })
  fundingStatus!: string;
  
  @StringField({ nullable: true, array: true })
  industry?: string[];

  @StringField({ nullable: true })
  presentationStatus!: string;

  @StringField({ nullable: true })
  transgender!: string;

  @StringField({ nullable: true })
  disability!: string;

  @StringField({ nullable: true, array: true })
  companyRoles?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true })
  workingStatus!: string;

  @StringField({ nullable: true })
  pronouns!: string;

  @StringField({ nullable: true })
  source!: string;

  @StringField({ nullable: true })
  bubbleLocation!: string;
}

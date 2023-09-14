// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { JoinColumn } from 'typeorm';
import { BaseModel, BooleanField, IntField, Model, OneToOne, StringField } from 'warthog';
import { Organization } from '../../identity/organization/organization.model';
import { User } from '../../identity/user/user.model';

@Model()
export class Startup extends BaseModel {
  @OneToOne(() => User, 'startup')
  user!: User;

  @StringField({ computed: true })
  userId!: string;

  @StringField({ nullable: true })
  name!: string;

  @StringField({ nullable: true })
  website!: string;

  @StringField({ nullable: true })
  corporateStructure!: string;

  @StringField({ nullable: true })
  country!: string;

  @StringField({ nullable: true })
  stateProvince!: string;

  @StringField({ nullable: true })
  fundraiseStatus!: string;

  @StringField({ nullable: true })
  companyStage!: string;

  @StringField({ nullable: true })
  revenue!: string;

  @StringField({ array: true, default: [] as any })
  industries!: string[];

  @StringField({ nullable: true })
  shortDescription!: string;

  @StringField({ nullable: true })
  tinyDescription!: string;

  @StringField({ nullable: true })
  originStory!: string;

  @StringField({ nullable: true })
  presentationStatus!: string;

  @IntField({ nullable: true })
  deckComfortLevel!: number;

  @IntField({ nullable: true })
  presentationComfortLevel!: number;

  @StringField({ nullable: true })
  businessChallenge!: string;

  @StringField({ nullable: true })
  desiredSupport!: string;

  @StringField({ nullable: true })
  anythingElse!: string;

  @BooleanField({ nullable: true })
  additionalTeamMembers!: boolean;

  @OneToOne(() => Organization, 'startup')
  @JoinColumn()
  organization!: Organization;

  // Set this to computed as we automatically generate the organization when we create a startup
  @StringField({ filter: ['eq', 'in'], computed: true })
  organizationId!: string;
}

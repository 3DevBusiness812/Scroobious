// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { Matches } from 'class-validator';
import { JoinColumn, OneToOne } from 'typeorm';
import { BaseModel, Model, StringField, TextField } from 'warthog';
import { User } from '../../identity/user/user.model';

@Model()
export class InvestorProfile extends BaseModel {
  @OneToOne((type) => User, (user) => user.investorProfile)
  @JoinColumn()
  user!: User;

  @StringField({ computed: true, filter: ['eq'], unique: true })
  userId!: string;

  @StringField({ array: true })
  accreditationStatuses!: string[]; // Should be FK to a lookup_table

  @Matches(/^https:\/\/(www.)?linkedin.com\/in\/.+/, {
    message: 'URL must match https://www.linkedin.com/in/<handle>',
  })
  @StringField({ nullable: true })
  linkedinUrl!: string;

  @StringField({ array: true })
  investorTypes!: string[]; // Should be FK to a lookup_table

  @TextField({ nullable: true })
  thesis?: string; // Should be FK to a lookup_table

  @StringField({ nullable: true, array: true })
  criteria?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true, array: true })
  ethnicities?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true })
  gender?: string;

  @StringField({ nullable: true })
  pronouns?: string;

  @StringField({ nullable: true, array: true })
  industries?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true, array: true })
  demographics?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true })
  stateProvince?: string;

  @StringField({ nullable: true, array: true })
  companyStages?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true, array: true })
  fundingStatuses?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true, array: true })
  revenues?: string[]; // Should be FK to a lookup_table

  @StringField({ nullable: true })
  source!: string;
}

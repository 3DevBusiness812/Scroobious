// Note: all imports here should be directly to files and not to manifests or else you get a tricky TypeGraphQL Error
import { createHash } from 'crypto';
import { BeforeInsert, Index, ManyToOne } from 'typeorm';
import { BaseModel, DateTimeField, IdField, IDType, Model, StringField, TextField } from 'warthog';
import { User } from '../user/user.model';

@Model()
export class AuthAccount extends BaseModel {
  @ManyToOne(() => User, (user: User) => user.organizations)
  user?: User;

  @Index()
  @IdField()
  userId!: IDType;

  @StringField()
  providerType!: string;

  @Index()
  @StringField({ filter: ['eq'] })
  providerId!: string;

  @Index()
  @StringField({ filter: ['eq'] })
  providerAccountId!: string;

  @TextField({ nullable: true })
  refreshToken?: string;

  // AccessTokens are not (yet) automatically rotated by NextAuth.js
  // You can update it using the refreshToken and the accessTokenUrl endpoint for the provider
  @TextField({ nullable: true })
  accessToken?: string;

  // AccessTokens expiry times are not (yet) updated by NextAuth.js
  // You can update it using the refreshToken and the accessTokenUrl endpoint for the provider
  @DateTimeField({ nullable: true })
  accessTokenExpires?: string;

  // The compound ID ensures that there there is only one instance of an
  // OAuth account in a way that works across different databases.
  // It is not used for anything else.
  @StringField({ dbOnly: true, unique: true })
  compoundId!: string;

  @BeforeInsert()
  setCompoundId() {
    this.compoundId = createHash('sha256')
      .update(`${this.providerId}:${this.providerAccountId}`)
      .digest('hex');
  }
}

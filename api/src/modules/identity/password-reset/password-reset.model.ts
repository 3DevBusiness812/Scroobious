import { nanoid } from 'nanoid';
import { BeforeInsert } from 'typeorm';
import { BaseModel, DateTimeField, EmailField, EnumField, Model, StringField } from 'warthog';

export enum PasswordResetStatus {
  OPEN = 'OPEN',
  COMPLETE = 'COMPLETE',
}

@Model()
export class PasswordReset extends BaseModel {
  @EnumField('PasswordResetStatus', PasswordResetStatus, {
    filter: ['eq'],
    computed: true,
    nullable: false,
    default: PasswordResetStatus.OPEN,
  })
  status!: PasswordResetStatus;

  @EmailField({ unique: false })
  email!: string;

  @StringField({ computed: true, unique: true })
  token!: string;

  @BeforeInsert()
  setToken(): void {
    this.token = nanoid(64);
  }

  @DateTimeField({ computed: true })
  expiresAt!: Date;

  @BeforeInsert()
  setExpiresAt(): void {
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    this.expiresAt = nextWeek;
  }

  // Emails are case insensitive
  @BeforeInsert()
  setEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
}

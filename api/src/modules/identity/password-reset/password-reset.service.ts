import { Inject, Service } from 'typedi';
import { DeepPartial, EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BaseOptions } from 'warthog';
import { BaseService, ConfigService, CustomError, PasswordMismatchError } from '../../../core';
import { UserService } from '../user/user.service';
import { PasswordReset, PasswordResetStatus } from './password-reset.model';
import { ExecutePasswordResetInput } from './password-reset.resolver';

@Service('PasswordResetService')
export class PasswordResetService extends BaseService<PasswordReset> {
  constructor(
    @InjectRepository(PasswordReset) protected readonly repository: Repository<PasswordReset>,
    @Inject('UserService') public readonly userService: UserService,
    @Inject('ConfigService') public readonly configService: ConfigService
  ) {
    super(PasswordReset, repository);
  }

  passwordResetLink(token: string) {
    return this.configService.getWebUrl(`/auth/password-reset?token=${token}`);
  }

  async create(data: DeepPartial<PasswordReset>, userId: string): Promise<PasswordReset> {
    this.logger.info(`Processing password reset request for: '${data.email}'`);
    if (!data.email) {
      this.logger.error(`Password reset attempted on empty email`);
      return null as any;
    }

    const email = data.email.trim().toLowerCase();

    try {
      await this.userService.findOne({ email });
    } catch (error) {
      this.logger.error(`Error sending password reset to '${email}' - email not found`);
      return null as any; // We don't want to throw here as we don't want to expose whether a user has an account or not
    }

    // Note that password-reset.job.ts picks this up and processes it
    return super.create({ ...data, email }, userId);
  }

  @Transaction()
  async executeReset(
    data: ExecutePasswordResetInput,
    userId: string,
    options?: BaseOptions,
    @TransactionManager() transactionManager?: EntityManager
  ): Promise<boolean> {
    const manager = options?.manager || transactionManager;

    if (data.password !== data.confirmPassword) {
      throw new PasswordMismatchError('password', data.password);
    }
    const passwordResetRecord = await this.findOne({ token: data.token });

    if (passwordResetRecord.status === PasswordResetStatus.COMPLETE) {
      throw new CustomError(
        'status',
        passwordResetRecord.status,
        'Password reset token has already been claimed'
      );
    }

    if (passwordResetRecord.expiresAt < new Date()) {
      throw new CustomError(
        'expiresAt',
        passwordResetRecord.expiresAt,
        'Password reset token has expired'
      );
    }

    // Mark password reset as complete
    await this.update(
      { status: PasswordResetStatus.COMPLETE },
      { id: passwordResetRecord.id },
      userId,
      { manager }
    );

    // console.log('data.password :>> ', data.password);
    // console.log('passwordResetRecord.email :>> ', passwordResetRecord.email);

    // Actually update the user's password
    await this.userService.update(
      { password: data.password },
      { email: passwordResetRecord.email },
      userId,
      { manager }
    );

    return true;
  }
}

import { Arg, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { PasswordResetCreateInput } from '../../../../generated';
import { UserService } from '../user/user.service';
import { PasswordReset } from './password-reset.model';
import { PasswordResetService } from './password-reset.service';

@InputType()
export class ExecutePasswordResetInput {
  @Field()
  token!: string;

  @Field()
  password!: string;

  @Field()
  confirmPassword!: string;
}

@Resolver(PasswordReset)
export class PasswordResetResolver {
  constructor(
    @Inject('PasswordResetService') public readonly service: PasswordResetService,
    @Inject('UserService') public readonly userService: UserService
  ) {}

  // @Permission('password_reset:create')
  @Mutation(() => Boolean)
  async requestPasswordReset(@Arg('data') data: PasswordResetCreateInput): Promise<boolean> {
    const reset = await this.service.create(data, this.userService.ANONYMOUS_USER_ID);
    return !!reset;
  }

  // @Permission('password_reset:create')
  @Mutation(() => Boolean)
  async executePasswordReset(@Arg('data') data: ExecutePasswordResetInput): Promise<boolean> {
    return this.service.executeReset(data, this.userService.ANONYMOUS_USER_ID);
  }
}

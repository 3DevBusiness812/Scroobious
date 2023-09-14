import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { IDType } from 'warthog';
import { UserCreateInput } from '../../../../generated';

@InputType()
export class UserLoginInput {
  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  password!: string;
}

@ObjectType()
export class UserLoginResponse {
  @Field(() => ID, { nullable: false })
  id!: IDType;

  @Field({ nullable: false })
  token!: string;
}

@InputType()
export class UserRegisterInput extends UserCreateInput {
  @Field({ nullable: false })
  type!: string;

  @Field({ nullable: false })
  confirmPassword!: string;
}

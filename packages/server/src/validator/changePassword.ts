import { ArgsType, Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { PasswordInput } from '../common/passwordInput';

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  @Length(1, 255)
  id: string;
}

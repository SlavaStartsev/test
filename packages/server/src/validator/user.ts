import { InputType, Field, ArgsType } from 'type-graphql';
import {
  Length,
  MinLength,
  IsEmail,
  ValidationArguments,
} from 'class-validator';
import { IsEmailInUse } from './isEmailInUse';
import { PasswordInput } from '../common/passwordInput';

@InputType()
export class SignupUserInput extends PasswordInput {
  @Field()
  @Length(1, 30)
  username: string;

  @Field()
  @IsEmail()
  @IsEmailInUse({
    message: ({ value }: ValidationArguments) => `${value} already in use`,
  })
  email: string;
}

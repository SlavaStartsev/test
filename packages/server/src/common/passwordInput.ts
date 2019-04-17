import { ArgsType, Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

@InputType()
export class PasswordInput {
  @Field()
  @Length(8, 30)
  password: string;
}

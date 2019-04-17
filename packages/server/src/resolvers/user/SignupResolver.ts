import bcrypt from 'bcrypt';

import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { SignupUserInput } from '../../validator/user';
import { sendEmail } from '../../utils/sendEmail';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';

@Resolver()
export class SignupResolver {
  @Mutation(returns => User)
  async signup(@Arg('data') { username, password, email }: SignupUserInput) {
    const hashedPassword = await bcrypt.hash(password, 11);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}

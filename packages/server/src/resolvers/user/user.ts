import {
  Arg,
  Resolver,
  Query,
  Ctx,
  FieldResolver,
  Mutation,
  Authorized,
  Args,
  UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { User } from '../../entity/User';
import { SignupUserInput } from '../../validator/user';
import { Context } from '../../types/Context';
import { isAuthorized } from '../../middleware/isAuthorized';
import { sendEmail } from '../../utils/sendEmail';
import { createConfirmationUrl } from '../../utils/createConfirmationUrl';
import { redis } from '../../redis';
import { ChangePasswordInput } from '../../validator/changePassword';

@Resolver()
export class UserResolver {
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

  @Mutation(returns => User, { nullable: true }) // fix
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    const user = await User.findOne({ username });

    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return null;
    }

    ctx.req.session.userId = user.id;

    if (!user.confirmed) {
      return null;
    }

    return user;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx()
  {
    req,
    res,
  }: Context) {
    await req.session!.destroy(err => {
      if (err) {
        console.log(err);
      }

      return true;
    });

    res.clearCookie('cypher');

    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Arg('id') id: string) {
    const userId = await redis.get(id);

    if (!userId) {
      return false;
    }

    await User.update(userId, { confirmed: true });
    await redis.del(id);

    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string) {
    const user = await User.findOne({ where: { email } });
    const id = v4();

    if (!user) {
      return false;
    }

    await redis.set(id, user.id, 'ex', 36e2);
    await sendEmail(email, `http://localhost:3000/user/change-password/${id}`);

    return true;
  }

  @Mutation(() => User, { nullable: true })
  async changePassword(@Arg('data')
  {
    id,
    password,
  }: ChangePasswordInput): Promise<User | null> {
    const userId = await redis.get(id);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(id);

    const hashedPassword = await bcrypt.hash(password, 11);

    user.password = hashedPassword;
    await user.save();

    return user;
  }

  // @FieldResolver()
  // accessToken(@Ctx() ctx: MyContext) {
  //   return ctx.req.session!.accessToken;
  // }

  // @Authorized()
  @UseMiddleware(isAuthorized) // same as above
  @Query(returns => User, { nullable: true })
  async me(@Ctx() ctx: Context) {
    const { userId } = ctx.req.session;

    return userId ? User.findOne(userId) : null;
  }
}

import bcrypt from 'bcrypt';

import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../types/context';

@Resolver()
export class LoginResolver {
  @Mutation(returns => User, { nullable: true }) // fix
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ) {
    const user = await User.findOne({ username });

    console.log(user);
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
}

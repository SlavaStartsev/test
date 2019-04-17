import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';

@Resolver()
export class ConfirmEmail {
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
}

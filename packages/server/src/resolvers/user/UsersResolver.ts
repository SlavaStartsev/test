import { Resolver, Query } from 'type-graphql';
import { User } from '../../entity/User';

@Resolver()
export class UserResolver {
  // test
  @Query(returns => [User], { nullable: true })
  async users() {
    const users = await User.find();

    return users;
  }
  // end test
}

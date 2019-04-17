import { Resolver, Mutation, Arg, ClassType } from 'type-graphql';
import { User } from '../entity/User';
import { SignupUserInput } from '../validator/user';

@Resolver()
export class CreateUserResolver {
  @Mutation(() => User)
  async createUser(@Arg('data') data: SignupUserInput) {
    return User.create(data).save();
  }
}

function createBaseResolver<T extends ClassType>(
  suffix: string,
  objectTypeCls: T,
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: T[] = [];

    @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(@Arg('first', type => Int) first: number): Promise<T[]> {
      return this.items.slice(0, first);
    }
  }

  return BaseResolver;
}

import { Connection } from 'typeorm';
import { testConnection } from '../../testConnection';
import Maybe from 'graphql/tsutils/Maybe';
import { graphql } from 'graphql';
import faker from 'faker';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './user';

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

let connection: Connection;

beforeAll(async () => {
  connection = await testConnection();
});

afterAll(async () => {
  await connection.close();
});

const registerMutation = `
mutation Signup($data: SignupUserInput!) {
  signup(
    data: $data
  ) {
    id
    username
    email
  }
}
`;

describe('register', () => {
  it('create user', async () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const schema = await buildSchema({
      resolvers: [UserResolver],
      authChecker: ({ context: { req } }) => {
        return !!req.session.userId;
      },
    });

    const userId = '123';
    const response = await graphql({
      schema,
      source: registerMutation,
      variableValues: {
        data: user,
      },
      contextValue: {
        req: {
          session: {
            userId,
          },
        },
        res: {
          clearCookie: jest.fn(),
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        signup: {
          ...(({ password, ...rest }) => rest)(user),
        },
      },
    });
  });
});

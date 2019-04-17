import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import queryComplexity, {
  fieldConfigEstimator,
  simpleEstimator,
} from 'graphql-query-complexity';

import { User } from './entity/User';
import { Context } from './types/context';
import { redis } from './redis';

import { UserResolver } from './resolvers/user/UsersResolver';
import { LoginResolver } from './resolvers/user/LoginResolver';
import { SignupResolver } from './resolvers/user/SignupResolver';
import { ConfirmEmail } from './resolvers/user/ConfirmEmail';

const startServer = async () => {
  const port = 4000;
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, LoginResolver, SignupResolver, ConfirmEmail],
      authChecker: ({ root, args, context: { req }, info }, roles) => {
        return !!req.session.userId; // <= Boolean
      },
    }),
    formatError: formatArgumentValidationError,
    context: ({ req, res }: Context) => ({ req, res }),
    // validationRules: [
    //   queryComplexity({
    //     // The maximum allowed query complexity, queries above this threshold will be rejected
    //     maximumComplexity: 8,
    //     // The query variables. This is needed because the variables are not available
    //     // in the visitor of the graphql-js library
    //     variables: {},
    //     // Optional callback function to retrieve the determined query complexity
    //     // Will be invoked weather the query is rejected or not
    //     // This can be used for logging or to implement rate limiting
    //     onComplete: (complexity: number) => {
    //       console.log('Query Complexity:', complexity);
    //     },
    //     estimators: [
    //       // Using fieldConfigEstimator is mandatory to make it work with type-graphql
    //       fieldConfigEstimator(),
    //       // This will assign each field a complexity of 1 if no other estimator
    //       // returned a value. We can define the default value for field not explicitly annotated
    //       simpleEstimator({
    //         defaultComplexity: 1,
    //       }),
    //     ],
    //   }) as any,
    // ],
  });
  const RedisStore = connectRedis(session);

  await createConnection({
    ...(await getConnectionOptions('development')),
    name: 'default',
  });

  app.use(
    cors({ credentials: true, origin: 'http://localhost:8080' }),
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'cypher',
      secret: 'asd',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 864e5 * 7,
      },
    }),
  );

  server.applyMiddleware({ app, cors: false });

  app.listen({ port }, () => {
    console.log(
      `🚀  Server ready at http://localhost:${port}${server.graphqlPath}`,
    );
  });
};

startServer();

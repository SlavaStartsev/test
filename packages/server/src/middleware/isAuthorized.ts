import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/context';

export const isAuthorized: MiddlewareFn<Context> = async (
  { context },
  next,
) => {
  if (!context.req.session.userId) {
    throw new Error('not authorized');
  }

  return next();
};

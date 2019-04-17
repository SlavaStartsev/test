import { v4 } from 'uuid';

import { redis } from '../redis';

export async function createConfirmationUrl(userId: string) {
  const id = v4();

  await redis.set(id, userId, 'ex', 36e2);

  return `http://localhost:3000/user/confirm/${id}`;
}

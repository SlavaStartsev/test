import { createConnection, getConnectionOptions } from 'typeorm';

export const testConnection = async () => {
  return createConnection({
    ...(await getConnectionOptions('test')),
    name: 'default',
  });
};

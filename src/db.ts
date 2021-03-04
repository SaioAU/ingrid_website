import 'reflect-metadata';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';

import { User } from './entities';
import { getConnectionName } from './utils';

const intializeDB = async (): Promise<void> => {
  const name = getConnectionName();
  const connectionOptions = await getConnectionOptions(name);

  await createConnection({ ...connectionOptions, name });

  // Since we are using several connections https://github.com/typeorm/typeorm/issues/2715#issuecomment-465322936
  User.useConnection(getConnection(name));
};

export default intializeDB;

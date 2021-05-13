/* eslint no-console: 0 */

import intializeDB from '../db';
import { User } from '../entities';
import { omit } from '../utils';

// Example use: npm run list-users

intializeDB()
  .then(async () => {
    const users = await User.find();
    const haveUsers = users.length > 0;
    console.log(`${users.length} user(s)${haveUsers ? ':' : ''}`);
    if (haveUsers) console.log();
    users.forEach((user) => console.log(omit({ ...user }, ['password'])));
  })
  .catch(() => {
    throw new Error('Could not list users');
  });

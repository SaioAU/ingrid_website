import intializeDB from '../db';
import { User } from '../entities';
import { omit } from '../utils';

// Example use: npm run createUser -- "Snoopy Snoop" test@example.com password

intializeDB()
  .then(async () => {
    const [, , name, email, password] = process.argv;
    const user = await User.createUser(name, email, password);
    console.log('✅ Success! created', omit({ ...user }, ['password']));
  })
  .catch(() => {
    throw new Error('Could not create user');
  });

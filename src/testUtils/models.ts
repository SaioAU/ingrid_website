import { User } from '../entities';

export const createUser = async ({
  name = 'user 1',
  email = 'user1@example.com',
  password = 'password1',
}: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<User | undefined> => {
  const user = await User.createUser(name, email, password);
  return user;
};

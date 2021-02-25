import { User } from '../entities';

export const createUser = async ({
  name = 'user 1',
  email = 'user1@example.com',
  password = 'password1',
}: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<User> => {
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  await user.save();
  return user;
};

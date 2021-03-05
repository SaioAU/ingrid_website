/* eslint no-param-reassign: 0 */
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { User } from '../entities';
import { getConnectionName, hash } from '../utils';

// Wrap functions in class to be able to use decorator

class UserController {
  @Transactional({ connectionName: getConnectionName })
  static async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await User.createUser(name, email, password);
    return user;
  }

  @Transactional({ connectionName: getConnectionName })
  static async update(
    user: User,
    name?: string,
    email?: string,
  ): Promise<void> {
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await user.save();
  }

  @Transactional({ connectionName: getConnectionName })
  static async delete(user: User): Promise<void> {
    await user.remove();
  }

  @Transactional({ connectionName: getConnectionName })
  static async resetPassword(
    user: User,
    password: string,
  ): Promise<Error | undefined> {
    try {
      const hashedPassword = await hash(password);
      user.password = hashedPassword;
      await user.save();
      return undefined;
    } catch (err) {
      return new Error(err);
    }
  }
}

export default UserController;

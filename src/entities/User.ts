import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getConnection,
} from 'typeorm';

import { getConnectionName, hash } from '../utils';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  async checkUnencryptedPassword(password: string): Promise<boolean> {
    try {
      const salt = this.password.split(':')[0];
      const hashedPassword = await hash(password, salt);

      return hashedPassword === this.password;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  static async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = new User();
    user.name = name;
    user.email = email;

    try {
      const hashedPassword = await hash(password);
      user.password = hashedPassword;
    } catch (err) {
      return undefined;
    }

    await user.save();
    return user;
  }
}

export default User;

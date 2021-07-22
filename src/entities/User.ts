import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { hash } from '../utils';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  getTakeout(): UserTakeout {
    return { name: this.name, email: this.email, id: this.id };
  }

  async checkUnencryptedPassword(password: string): Promise<boolean> {
    try {
      const salt = this.password.split(':')[0];
      const hashedPassword = await hash(password, salt);

      return hashedPassword === this.password;
    } catch (err) {
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

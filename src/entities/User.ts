import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { hash } from '../utils';

// TODO: hash password on creation here

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
      return false;
    }
  }
}

export default User;

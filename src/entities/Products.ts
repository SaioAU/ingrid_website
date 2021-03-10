import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  
  @Entity()
  class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    category: string;

    @Column()
    description: string;
    
    @Column()
    name: string;
  
    @Column()
    colour: string;
  
    @Column()
    price: string;

    @Column({
        nullable: true,
    })
    size: string; 

  
  }
  
  export default User;
  
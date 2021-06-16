import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
  } from 'typeorm';
import Product from "./Products";


  @Entity()
  class Season extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    year: number;

    @Column()
    name: string;

    @OneToMany(() => Product, product => product.season)
    products: Product[];


    // this function needs to  be restricted to ingrid, how do i check if user logged in first?

    static async createSeason(
    name: string,
    year: number,
  ): Promise<Season | undefined> {
    const season = new Season();
    season.name = name;
    season.year = year;

    await season.save();
    return season;
  }
}

  export default Season;

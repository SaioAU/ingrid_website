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

  static async get(seasonId: string, includeProducts = false): Promise<Season | undefined> {
    const season = await Season.findOne({ id: seasonId });

    if (!season) return undefined;
    if (!includeProducts) return season;

    const products = await Product.find({ where: { season: { id: seasonId } } });
    season.products = products;
    return season;
  }
}

  export default Season;

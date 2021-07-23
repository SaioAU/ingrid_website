import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
  } from 'typeorm';

import Season from "./Seasons"


  @Entity()
  class Product extends BaseEntity {
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
    price: number;

    @Column()
    material: string;

    @Column()
    care: string;

    @Column({
        nullable: true,
    })
    size: string ;

    @Column({
      name: 'seasonId', nullable: true
    })
    seasonId: string;
    
    @ManyToOne(() => Season, season => season.products, {nullable: true})
    @JoinColumn({name : 'seasonId'})
    season: Season;



    // this function needs to  be restricted to ingrid, how do i check if user logged in first?

    static async createProduct(
    name: string,
    category: string,
    size: string,
    colour: string,
    description: string,
    price: number,
    material: string,
    care: string,
    seasonId?: string,
  ): Promise<Product | undefined> {
    const product = new Product();
    product.name = name;
    product.category = category;
    product.size = size;
    product.price = price;
    product.description = description;
    product.colour = colour;
    product.material = material;
    product.care = care;

    if(typeof seasonId === 'string'){
        const season = await Season.findOne({id: seasonId});

        if (season) {
          product.season = season;
          season.products = [ ...(season.products  || []), product ]
        };
    }

    await product.save();
    return product;
  }
}

  export default Product;

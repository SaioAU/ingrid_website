import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
  } from 'typeorm';

import Product from "./Products"


  @Entity()
  class Image extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    colour: string;

    @Column()
    data: string;

    @Column({
      name: 'productId', nullable: true
    })
    productId: string;

    @ManyToOne(() => Product, product => product.images, {nullable: true})
    @JoinColumn({name : 'productId'})
    product: Product;

    // this function needs to  be restricted to ingrid, how do i check if user logged in first?

  static async createImage(
    data: string,
    colour: string,
    productId?: string,
  ): Promise<Image | undefined> {
    const image = new Image();
    image.colour = colour;
    image.data = data;


    if(typeof productId === 'string'){
        const product = await Product.findOne({id: productId});

        if (product) {
          image.product = product;
          product.images = [ ...(product.images  || []), image ]
        };
    }

    await image.save();
    return image;
  }
}

  export default Image;

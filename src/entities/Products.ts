import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
  } from 'typeorm';

import Season from "./Seasons"
import Image from "./Images"


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

    @OneToMany(() => Image, image => image.product)
    images: Image[];



    // this function needs to  be restricted to ingrid, how do i check if user logged in first?

  async updateImages(imagesData: { id?: string, data: string, colour: string }[]): Promise<void> {
    const currentImages = await Image.find({ where: { product: { id: this.id } } });

    // Delete
    const deletedImages = currentImages.filter(({ id }) => !imagesData.find((data) => data.id === id));
    await Promise.all(deletedImages.map(async (image) => await Image.delete(image)));

    // Create
    const newImagesData = imagesData.filter(({ id }) => !id);
    const newImages = await Promise.all(newImagesData.map(async (image) => {
      return await Image.createImage(image.data, image.colour, this.id);
    }));

    const keptImages = currentImages.filter(({ id }) => Boolean(imagesData.find((data) => data.id === id)));
    // TODO: Update (colour etc)

    this.images = [...keptImages, ...newImages];
  }

  static async createProduct(
    name: string,
    category: string,
    size: string,
    colour: string,
    description: string,
    price: number,
    material: string,
    care: string,
    images: { data: string, colour: string }[],
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

    if(seasonId && typeof seasonId === 'string'){
        const season = await Season.findOne({ id: seasonId });

        if (season) {
          product.season = season;
          season.products = [ ...(season.products  || []), product ]
        };
    }

    await product.save();
    await product.updateImages(images);

    return product;
  }

  static async get(productId: string): Promise<Product | undefined> {
    const product = await Product.findOne({ id: productId });

    if (!product) return undefined;

    const images = await Image.find({ where: { product: { id: productId } } });
    product.images = images;

    return product;
  }

  // Avoid circular json
  serialize(): Product {
    const { season, images = [] } = this;
    const { products, ...seasonWithoutProducts } = season ?? {};

    return {
      ...this,
      images: images.map(({ product, ...rest }) => rest),
      season: seasonWithoutProducts,
    };
  }
}

  export default Product;

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
  } from 'typeorm';
  
  
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
    size: number; 

    @Column({
      nullable: true,
  })
  season: string;

    // this function needs to  be restricted to ingrid, how do i check if user logged in first?
  
    static async createProduct(
    name: string,
    category: string,
    size: number,
    colour: string,
    description: string,
    price: number,
    material: string,
    care: string,
    season: string,
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
    product.season  = season;

    await product.save();
    return product;
  }
}
  
  export default Product;

  
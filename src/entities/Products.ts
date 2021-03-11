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
    price: string;

    @Column({
        nullable: true,
    })
    size: string; 

    // this function needs to  be restricted to ingrid, how do i check if user logged in first?
  
    async createProduct(
    name: string,
    category: string,
    size: string,
    colour: string,
    description: string,
    price: string,
  ): Promise<Product | undefined> {
    const product = new Product();
    product.name = name;
    product.category = category;
    product.size = size;
    product.price = price;
    product.description = description;
    product.colour = colour

    await product.save();
    return product;
  }
}
  
  export default Product;

  
import intializeDB from '../db';
import { Product } from '../entities';
import { omit } from '../utils';

// Example use: npm run createProduct -- "Snoopy Snoop" test@example.com password

intializeDB()
  .then(async () => {
    const [colour, size, name, description, price, category] = process.argv;
    const product = await Product.createProduct(name, description, colour, size, price, category);
    console.log('✅ Success!', omit({ ...product }, ['password']));
  })
  .catch(() => {
    throw new Error('Could not create product');
  });

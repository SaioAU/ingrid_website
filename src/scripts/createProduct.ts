import intializeDB from '../db';
import { Product } from '../entities';
import { omit } from '../utils';

// Example use: npm run createProduct -- "Snoopy Snoop" test@example.com password

intializeDB()
  .then(async () => {
    const [, , name, email, password] = process.argv;
    const product = await Product.createProduct(name, email, password);
    console.log('✅ Success!', omit({ ...product }, ['password']));
  })
  .catch(() => {
    throw new Error('Could not create product');
  });

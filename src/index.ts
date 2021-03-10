import dotenv from 'dotenv';

import app from './server';
import intializeDB from './db';

dotenv.config();

const port = Number(process.env.PORT || 3000);

intializeDB()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Express server started on port: ${port}`);
    });
  })
  .catch(() => {
    throw new Error('Could not initialize DB');
  });

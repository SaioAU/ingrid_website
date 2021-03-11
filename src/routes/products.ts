import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Product } from '../entities';
import { UserController } from '../controllers';
import { checkJwt } from './middlewares';

const router = Router();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

// curl -H "Auth: ..." http://localhost:3000/products/all
router.get(
  '/all',
  [checkJwt],
  async (_: Request, res: Response): Promise<void> => {
    const products = await Product.find();

    res.status(OK).json(products);
  },
);

// curl -H "Auth: ..." http://localhost:3000/products?id=1
router.get(
  '/',
  [checkJwt],
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const product = await Product.findOne({ id });

    res.status(OK).json(product);
  },
);

/*
curl -H "Auth: ..." -XPOST -H "Content-Type: application/json" http://localhost:3000/products \
--data '{"category": "handbag", "name": "classy", "size": "big", "price": "expensive", "colour": "blue", "description": "awesome"}'
*/
router.post(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, ProductInput>,
    res: Response,
  ): Promise<void> => {
    const { category, description, name, colour, price, size } = req.body;

    if (!category || !description || !name || !colour || !price || !size ) {
      res.status(BAD_REQUEST).send('Missing email, name or password');
      return;
    }

    const product = await Product.create(category, description, name, colour, price, size);

    if (!product) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not create product');
      return;
    }

    res.status(OK).json(product);
  },
);

/*
curl -H "Auth: ..." -XPATCH -H "Content-Type: application/json" http://localhost:3000/products \
--data '{"id": 1, "name": "new name"}'
*/
router.patch(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, ProductInput>,
    res: Response,
  ): Promise<void> => {
    const { id, category, description, name, colour, price, size } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const product = await Product.findOne({ id });

    if (!product) {
      res.status(NOT_FOUND).send('Product not found');
      return;
    }

    await Product.update(category, description, name, colour, price, size);

    res.status(OK).json(product);
  },
);

/*
curl -H "Auth: ..." -XDELETE -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1}'
*/
router.delete(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    if (!user) {
      res.status(NOT_FOUND).send('User not found');
      return;
    }

    await UserController.delete(user);

    res.status(OK).json({ id });
  },
);

export default router;

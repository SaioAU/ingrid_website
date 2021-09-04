import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Product, Season, Image } from '../entities';
import { checkJwt } from './middlewares';

const router = Router();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

// curl http://localhost:3000/products/read/all
router.get(
  '/read/all',
  async (_: Request, res: Response): Promise<void> => {
    const products = await Product.find();

    res.status(OK).json(products.map((product) => product.serialize()));
  },
);

// curl http://localhost:3000/products/read?id=8c1c468c-3055-4ce0-b354-fc70387f99b6
router.get(
  '/read',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const product = await Product.get(id);

    if (!product) {
      res.status(NOT_FOUND);
      return;
    }

    res.status(OK).json(product.serialize());
  },
);

/*
curl -H "Auth: ..." -XPOST -H "Content-Type: application/json" http://localhost:3000/products/create \
--data '{"category": "handbag", "name": "classy", "size": "big", "price": 1000, "colour": "blue", "description": "awesome", "material": "cotton", "care": "handwashed", "season": "summer"}'
*/
router.post(
  '/create',
   //[checkJwt],
  async (
    req: Request<GenericObject, GenericObject, ProductInput>,
    res: Response,
  ): Promise<void> => {
    const { category, description, name, colour, price, size, material, care, seasonId, images} = req.body;

    if (!category || !description || !name || !colour || !price || !size || !material || !care || !seasonId || !images) {
      res.status(BAD_REQUEST).send('Missing one of the fields for product');
      console.log({ category, description, name, colour, price, size, material, care});

      return;
    }

    const product = await Product.createProduct(name, category, size.toString(), colour, description, price, material, care, images, seasonId);

    if (!product) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not create product');
      return;
    }

    res.status(OK).json(product.serialize());
  },
);

/*
curl -H "Auth: ..." -XPATCH -H "Content-Type: application/json" http://localhost:3000/products/update \
--data --data '{"id": "b4f7b015-3fbc-4fe9-b5ce-244d11bb87d2", "category": "handbag", "name": "classy", "size": 4, "price": 1000, "colour": "blue", "description": "awesome", "material": "cotton", "care": "handwashed", "seasonId": "9d573d0b-6909-4637-a51d-48535d0c1482"}'
*/
router.patch(
  '/update',
   // [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, ProductInput>,
    res: Response,
  ): Promise<void> => {
    const {
      id,
      category,
      description,
      name,
      colour,
      price,
      size,
      material,
      care,
      seasonId,
      images = [],
    } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    if(typeof category !== 'string'){
        res.status(BAD_REQUEST).send('Missing category');
      return;
    }

    if(typeof description !== 'string'){
        res.status(BAD_REQUEST).send('Missing description');
      return;
    }

    if(typeof name !== 'string'){
        res.status(BAD_REQUEST).send('Missing name');
      return;
    }

    if(typeof colour !== 'string'){
        res.status(BAD_REQUEST).send('Missing colour');
      return;
    }

    if(typeof price !== 'number'){
        res.status(BAD_REQUEST).send('Missing price');
      return;
    }

    if(typeof size !== 'string' &&  typeof size !== 'number'){
        res.status(BAD_REQUEST).send('Missing size');
      return;
    }

    if(typeof material !== 'string'){
        res.status(BAD_REQUEST).send('Missing material');
      return;
    }

    if(typeof care !== 'string'){
        res.status(BAD_REQUEST).send('Missing care');
      return;
    }

    const product = await Product.get(id);

    if (!product) {
      res.status(NOT_FOUND).send('Product not found');
      return;
    }

    if (typeof seasonId === 'string') {
      const season = await Season.findOne({id: seasonId});

      if (season) {
        product.season = season;
        season.products = [ ...(season.products ?? []), product ];
      };
    }

    product.category = category;
    product.colour = colour;
    product.description = description;
    product.size = size.toString();
    product.name = name;
    product.price = price;
    product.material = material;

    await product.updateImages(images);
    await product.save();

    res.status(OK).json(product.serialize());
  },
);

/*
curl -H "Auth: ..." -XDELETE -H "Content-Type: application/json" http://localhost:3000/products/delete \
--data '{"id": 1}'
*/
router.delete(
  '/delete',
   [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, ProductInput>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const product = await Product.findOne({ id });

    if (!product) {
      res.status(NOT_FOUND).send('Product not found');
      return;
    }

    await Product.delete(product);

    res.status(OK).json({ id });
  },
);

export default router;

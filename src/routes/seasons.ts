import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Season } from '../entities';
import { checkJwt } from './middlewares';

const router = Router();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

// curl http://localhost:3000/seasons/read/all
router.get(
  '/read/all',
  async (_: Request, res: Response): Promise<void> => {
    const seasons = await Season.find();

    res.status(OK).json(seasons);
  },
);

// curl http://localhost:3000/seasons/read?id=9d573d0b-6909-4637-a51d-48535d0c1482
router.get(
  '/read',
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const season = await Season.findOne({ id });

    res.status(OK).json(season);
  },
);

/*
curl -H "Auth: ..." -XPOST -H "Content-Type: application/json" http://localhost:3000/seasons/create \
--data '{"name": "autumn", "year": 1985}'
*/
router.post(
  '/create',
   [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, SeasonInput>,
    res: Response,
  ): Promise<void> => {
    const { name, year} = req.body;

    if (!name || !year ) {
      res.status(BAD_REQUEST).send('Missing name or year');
      return;
    }

    const season = await Season.createSeason(name, year);

    if (!season) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not create season');
      return;
    }

    res.status(OK).json(season);
  },
);

/*
curl -H "Auth: ..." -XPATCH -H "Content-Type: application/json" http://localhost:3000/seasons/update \
--data --data '{"id": "b4f7b015-3fbc-4fe9-b5ce-244d11bb87d2", "category": "handbag", "name": "classy", "size": 4, "price": 1000, "colour": "blue", "description": "awesome", "material": "cotton", "care": "handwashed", "season": "summer"}'
*/
router.patch(
  '/update',
   [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, SeasonInput>,
    res: Response,
  ): Promise<void> => {
    const { id, year, name} = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    if(typeof name !== 'string'){
        res.status(BAD_REQUEST).send('Missing name');
      return;
    }

    if(typeof year !== 'string'){
        res.status(BAD_REQUEST).send('Missing year');
      return;
    }

    const season = await Season.findOne({ id });

    if (!season) {
      res.status(NOT_FOUND).send('Season not found');
      return;
    }

    season.year = year
    season.name = name

    res.status(OK).json(season);
  },
);

/*
curl -H "Auth: ..." -XDELETE -H "Content-Type: application/json" http://localhost:3000/seasons/delete \
--data '{"id": 1}'
*/
router.delete(
  '/delete',
   [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, SeasonInput>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const season = await Season.findOne({ id });

    if (!season) {
      res.status(NOT_FOUND).send('Season not found');
      return;
    }

    await Season.delete(season);

    res.status(OK).json({ id });
  },
);

export default router;

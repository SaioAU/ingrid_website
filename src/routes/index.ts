import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import AuthRouter from './auth';
import UserRouter from './users';
import ProductsRouter from './products';
import SeasonsRouter from './seasons';

const router = Router();

router.get('/', (_: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).send('Unknown route');
});

// curl http://localhost:3000/healthcheck
router.get('/healthcheck', (_: Request, res: Response): void => {
  res.status(StatusCodes.OK).send('ok');
});

router.use('/users', UserRouter);

router.use('/auth', AuthRouter);

router.use('/products', ProductsRouter);

router.use('/seasons', SeasonsRouter);

export default router;

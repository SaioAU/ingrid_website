import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(helmet());

app.use(
  cors({
    exposedHeaders: ['authToken'],
    origin: 'http://localhost:3004', // TODO: env
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/', routes);

export default app;

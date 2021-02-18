import 'reflect-metadata';
import { createConnection } from 'typeorm';

const intializeDB = async (): Promise<void> => {
  await createConnection();
};

export default intializeDB;

export default [
  {
    type: 'postgres',
    name: 'default',
    host: 'localhost',
    port: 5432,
    username: 'saioaarosteguiurrutia',
    synchronize: false,
    migrationsRun: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscribers',
    },
    database: "ingrid_website",
  },
  {
    type: 'postgres',
    name: 'test',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    synchronize: true,
    migrationsRun: false,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscribers',
    },
  },
];

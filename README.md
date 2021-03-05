## Run

Start dev server: `npm start`

Set port through env variable `PORT` (default: 3003)

## Authentication

Uses JSON web tokens. Auth token sent in header as `auth` and refresh token in http only cookie.

## Create user

You need a user to do anything since endpoints are authenticated. This can be done with a script:

```bash
npm run createUser -- "Snoopy Snoop" test@example.com password
```

## Typeorm Client

Run with `npm run typeorm`, separating parameters with `--`

#### Examples:

Creating migration with name `initial`:

```bash
npm run typeorm migration:generate -- -n initialize
```

Running migrations

```bash
npm run typeorm migration:run
```

Revert last migration

```bash
npm run typeorm migration:revert
```

## Routes

Two main routes:

- /auth
  - /login POST
  - /reset-password PATCH
  - /refresh-token GET
- /users
  - /all GET
  - / GET
  - / POST
  - / PATCH
  - / DELETE

## Tests

Run with `npm test`

Uses a different database connection, identified by `NODE_ENV=test`

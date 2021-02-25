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

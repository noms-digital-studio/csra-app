# CSRA Application
Cell Sharing Risk Assessment application.

## Before you start
The app uses a `.env` file to manage the applications environmental variables.
An example [file](.env.template) can be duplicated and updated according to you're needs.
Once changes are done save the file naming it `.env`.


## Commands Available

### Install dependencies
```
yarn
```

### Build
Builds JS, SCSS, Images and Fonts.
```
yarn run build
```

### Test
Runs tests once.
```
yarn test
```

### Test watch
Runs tests continuously.

```
yarn test:watch
```

### Test end to end tests
To run the end to end test you will need to have a running server `yarn start` then simply run:
```
yarn test:integration
```

### Lint
Runs the lint using [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
```
yarn lint
```

### Verify
Runs tests and linter
 ```
yarn verify
```

### Run E2E tests
```
yarn test:e2e
```

### Run
Starts the server on `PORT 5000` in dev mode
```
yarn start:dev
```

Starts the server on `PORT 5000` in prod mode (prerequisite you wil have to run NODE_ENV=production yarn build)
```
yarn start
```

Then go to [http://localhost:5000/](http://localhost:5000/)

### Deploy to Stage
Deploy the application to the STAGE environment and run the E2E tests against STAGE. See the note above regarding Firefox

*Note when running this script you will need firefox and jq installed*
```
Firefox can be installed by going to:

https://www.mozilla.org/en-GB/firefox/new/
```

```
jq can be installed using homebrew:

brew install jq
```

If these are installed then all you need to run is the following:

```
./promote-from-mock-to-stage.sh
```

## Monitoring endpoint

### GET `/health`

e.g.

Request: ```curl http://localhost:5000/health ```


Response:
```
{
  "buildNumber": "123",
  "gitRef": "6fb33281f349f57068de83efa1585c3e5bcaa56f",
  "gitDate": "2017-05-31T15:35:26+00:00",
  "questionHash": {
    "risk": "f0bced7986884fd9ea6186880870fd7a64776beb",
    "healthcare": "1ed3fe4ab79f3351947438a15f017f11d47fd89d"
  }
}
```

## Database connections

This can be left out in dev mode, and any API routes which use the database will fail.

In production the DB connection config is required. The variable should be set like this:

DB_URI=mssql://username:password@server-host:1433/database-name?encrypt=true

### Migrations

Migrations are managed using [knex](http://knexjs.org/#Migrations-CLI).

You can execute them with
```
yarn run migrate
```

Other knex commands can be run via
```
yarn run knex -- <other args>
```

### Local database setup
```
docker pull microsoft/mssql-server-linux
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=<password>' -p 1433:1433 -d microsoft/mssql-server-linux
npm install -g sql-cli
mssql -s localhost -u sa -p <password>
create database csra
.quit
yarn run knex -- migrate:currentVersion
yarn run migrate
```

### Local database manual querying 
```
mssql -s localhost -u sa -p <password> -d csra
select * from assessments
```

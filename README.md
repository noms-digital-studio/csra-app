# CSRA Application
Cell Sharing Risk Assessment application.

[![CircleCI](https://circleci.com/gh/noms-digital-studio/csra-app.svg?style=svg)](https://circleci.com/gh/noms-digital-studio/csra-app)

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

#### Run both E2E and REST tests

```
yarn test:integration
```

#### Run E2E tests
```
yarn test:e2e
```

#### Run REST tests
```
yarn test:rest
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

## Endpoints

### Viper Rating: GET `/api/viper/{nomisId}`

Returns the Viper rating and status 200 for a known Nomis ID or 404 when not found.

e.g.

Request: ```curl http://localhost:5000/api/viper/J1234LO```

Response:
```
{
  "nomisId": "J1234LO",
  "viperRating": 0.35
}
```

### Save Assessment: POST `/api/assessment` DEPRECATED

e.g.

Request:
```
curl -X POST http://localhost:5000/api/assessment -H 'Content-Type: application/json'
-d '{"nomisId":"J1234LO","type":"risk","outcome":"single cell","viperScore":0.45,
"questions":{"Q1":{"question_id":"Q1","question":"Are you part of a gang?","answer":"Yes"}},
"reasons":[{"question_id":"Q1","reason":"reason one"}]}'
```

Response:
```
{
  "status":"OK",
  "data": {
    "id":48
    }
}
```

### Save Prisoner Assessment: POST `/api/assessments`

Returns 201 (CREATED) and the id of the prisoner assessment that was created, 400 if the request body is invalid 
or 500 if the data cannot be saved.

e.g.

Request:
```
curl -X POST http://localhost:5000/api/assessments -H 'Content-Type: application/json'
-d '{"nomisId":"J1234LO", "forename": "John", "surname":"Lowe", "date-of-birth":"30 December 1978"}'
```

Response:
```
{
  "id":123
}
```

### Get Prisoner Assessment summary list: GET `/api/assessments`

Returns 200 and the prisoner assessment summary list or 500 if the data cannot be retrieved.

e.g.

Request: ```curl -X GET http://localhost:5000/api/assessments ```

Response:
```
[{
      id: 123
      nomisId: 'J1234LO',
      forename: 'John',
      surname: 'Lowe',
      dateOfBirth: '14-07-1967',
      outcome: 'Shared Cell',
      riskAssessment: false,
      healthAssessment: false,
}]
```

### Monitoring: GET `/health`

e.g.

Request: ```curl http://localhost:5000/health ```


Response:
```
{
  "status": "OK",
  "buildNumber": "dev",
  "gitRef": "97ada1b3ee8a33f7a129c14092553ac839d71b84",
  "gitDate": "2017-07-06T16:10:30.000Z",
  "questionHash": {
    "risk": "77256ebff2e778dc820b8c8f9de2ca14c0d1ec6e",
    "healthcare": "1ed3fe4ab79f3351947438a15f017f11d47fd89d"
  },
  "checks": {
    "db": "OK",
    "viperRestService": "OK"
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

To run the database locally, use the [docker image](https://hub.docker.com/r/microsoft/mssql-server-linux/).
```
docker pull microsoft/mssql-server-linux
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=<password>' -p 1433:1433 -d microsoft/mssql-server-linux
```

After you have a database, you'll need to create the database and application user. On real environments this is handled by the terraform code.
```
npm install -g sql-cli
mssql -s localhost -u sa -p <password>
USE master;
EXEC sp_configure 'contained database authentication', 1;
RECONFIGURE WITH OVERRIDE;
CREATE DATABASE csra CONTAINMENT = PARTIAL COLLATE SQL_Latin1_General_CP1_CI_AS;
USE csra;
CREATE USER <database-user> WITH PASSWORD = '<database-user-password>';
.quit
```

And then run the migrations as with any other environment.
```
yarn run knex -- migrate:currentVersion
yarn run migrate
```

### Local database manual querying

The `sql-cli` package installed above gives you a commandline client called `mssql`.

```
mssql -s localhost -u <database-user> -p <password> -d csra
select * from assessments
```

### Seeding database viper table
** Caution when runing this script ensure that you are pointing to your database driver to the correct database enviroment **

Simply running the following command will generate 100 random seeds to the viper table.
``` ./bin/seed-viper ```

To specify a different number of random viper data to generate simply specify the number using the environmental variable `SEED_AMOUNT`:

```SEED_AMOUNT={number of seeds (int)} ./bin/seed-viper```

# Feature switches
With `USE_VIPER_SERVICE=false` the application will obtain viper ratings from it's local database. With
`USE_VIPER_SERVICE=true` the application will obtain viper ratings via a REST call to the analytics
gateway.

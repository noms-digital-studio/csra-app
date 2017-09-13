# CSRA Application
Cell Sharing Risk Assessment application.

[![CircleCI](https://circleci.com/gh/noms-digital-studio/csra-app.svg?style=svg)](https://circleci.com/gh/noms-digital-studio/csra-app)
[![Known Vulnerabilities](https://snyk.io/test/github/noms-digital-studio/csra-app/badge.svg)](https://snyk.io/test/github/noms-digital-studio/csra-app)

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

#### Run Smoke tests
The smoke test do not interact with the database like the e2e test do. Instead it creates a test user which is hidden from the dashboard and can only be seen on the dashboard with the query string `?displayTestAssessments=true`
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

### Filtering in test assessments on the dashboard
Nomis IDs that start with 'TEST' will be automatically filtered out from the dashboard to allow us to smoke test
in production. To view the test assessments add a query param - 'displayTestAssessments=true'

e.g.
```
http://localhost:5000/dashboard?displayTestAssessments=true
```

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

### Viper Rating: GET `/api/viper/<nomisId>`

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

### Save Prisoner Assessment: POST `/api/assessments`

Returns 201 (CREATED) and the id of the prisoner assessment that was created, 400 if the request body is invalid
or 500 if the data cannot be saved.

e.g.

Request:
```
curl -X POST http://localhost:5000/api/assessments -H 'Content-Type: application/json'
-d '{"nomisId":"J1234LO", "forename": "John", "surname":"Lowe", "dateOfBirth":"30 December 1978"}'
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
      riskAssessmentCompleted: false,
      healthAssessmentCompleted: false,
}]
```

### Save Risk Assessment: PUT `/api/assessments/<id>/risk`

Returns 200 (OK) to indicate the data was saved, 400 if the request body is invalid, 409 to indicate that the
risk assessment has already been completed for this record or 500 if the data cannot be saved.

e.g.

Request:
```
  curl -X PUT http://localhost:5000/api/assessments/123/risk -H 'Content-Type: application/json'
  -d '{"outcome": "single cell", viperScore": 0.35, "questions": {"Q1": {"questionId": "Q1", "question": "Example question text?","answer":"Yes"}},
  "reasons":[{"questionId":"Q1", "reason": "Example reason text"}]}'
```

### Get Risk Assessment: GET `/api/assessments/<id>/risk`

Returns 200 (OK) and the risk assessment or 404 if the prisoner assessment or risk assessment can't be found.
500 for any other errors.

e.g.

Request:
```
curl http://localhost:5000/api/assessments/1/risk
```

Response:
```
{
    viperScore: 0.35,
    questions: {
      Q1: {
        questionId: 'Q1',
        question: 'Example question text?',
        answer: 'Yes',
      },
    },
    reasons: [
      {
        questionId: 'Q1',
        reason: 'Example reason text',
      },
    ],
  };
```

### Save Health Assessment: PUT `/api/assessments/<id>/health`

Returns 200 (OK) to indicate the data was saved, 400 if the request body is invalid, 409 to indicate that the
health assessment has already been completed for this record or 500 if the data cannot be saved.

e.g.

Request:
```
  curl -X PUT http://localhost:5000/api/assessments/123/health -H 'Content-Type: application/json'
  -d '{"outcome": "single cell", viperScore": 0.35, "questions": {"Q1": {"questionId": "Q1", "question": "Example question text?","answer":"Yes"}},
  "reasons":[{"questionId":"Q1", "reason": "Example reason text"}]}'
```

### Get Health Assessment: GET `/api/assessments/<id>/health`

Returns 200 (OK) and the health assessment or 404 if the prisoner assessment or health assessment can't be found.
500 for any other errors.

e.g.

Request:
```
curl http://localhost:5000/api/assessments/1/health
```

Response:
```
{
    questions: {
      Q1: {
        questionId: 'Q1',
        question: 'Example question text?',
        answer: 'Yes',
      },
    },
    reasons: [
      {
        questionId: 'Q1',
        reason: 'Example reason text',
      },
    ],
  };
```

### Get Risk Assessment: GET `/api/assessments/<id>`

Returns 200 (OK) and the assessment or 404 if the prisoner assessment can't be found.
500 for any other errors.

e.g.

Request:
```
curl http://localhost:5000/api/assessments/1
```

Response:
```
{
    id: 123,
    createdAt: '2017-07-28T11:54:23.576Z',
    updatedAt: '2017-07-30T09:00:00.106Z',
    nomisId: 'J1234LO',
    forename: 'John',
    surname: 'Lowe',
    dateOfBirth: '14-07-1967',
    outcome: 'Shared Cell',
    riskAssessment: { ... },
    healthAssessment: { ... },
}
```

### Save assessment outcome: `PUT /api/assessments/<id>/outcome`

Returns 200 to indicate the data was saved, 400 if the request body is invalid or 500 if the data cannot be saved.

Valid outcomes: 'single cell', 'shared cell', 'shared cell with conditions'
e.g.
Request:
```
curl -X PUT http://localhost:5000/api/assessments/1/outcome -H 'Content-Type: application/json' -d '{"outcome": "single cell"}'
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
CREATE USER app WITH PASSWORD = '<database-user-password>';
CREATE USER tests WITH PASSWORD = '<database-test-user-password>';
GRANT SELECT, INSERT, UPDATE, DELETE TO tests;
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

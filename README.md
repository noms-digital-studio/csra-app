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

### Run
Starts the server on `PORT 5000`
```
yarn start
```

Then go to [http://localhost:5000/](http://localhost:5000/)

### Deploy to Stage
Deploy the application to the STAGE environment and run the E2E tests against STAGE
```
./scripts/promote-from-mock-to-stage.sh
```

## Monitoring endpoint

### GET `/health`

e.g.

Request: ```curl http://localhost:5000/health ```


Response:
```
{
  "status": "OK",
  "buildNumber": "63",
  "gitRef": "6fb33281f349f57068de83efa1585c3e5bcaa56f"
}
```

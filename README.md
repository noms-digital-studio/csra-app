# CSRA Application
Cell Sharing Risk Assessment application.

## Before you start
The app uses a `.env` file to manage the applications environmental variables.
an example [file](.env.template) can be duplicated and updated according to you're needs.
once changes are done save the file naming it `.env`.


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


## Monitoring endpoint

### GET `/health`

e.g.

```> curl http://localhost:5000/health ```

```{"status":"OK"}```

Then go to [http://localhost:5000/](http://localhost:5000/)

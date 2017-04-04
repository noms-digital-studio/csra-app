# CSRA Application
Cell Sharing Risk Assessment application.

## Comands Available

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

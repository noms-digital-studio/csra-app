const http = require('http');
const path = require('path');

const express = require('express');

// config parsing
const env = process.env;
const port = env.PORT || '5000';

// Express app
const app = express();


app.use('/', express.static(path.join(__dirname, '..', 'public')));

// actually listening
const server = http.createServer(app);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on http://localhost:${port}`);
});

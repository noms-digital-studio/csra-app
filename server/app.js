import path from 'path';
import express from 'express';

import healthRoute from './routes/health';

import { HEALTH_ENDPOINT } from './constants/routes';

// Express app
const app = express();

app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use(HEALTH_ENDPOINT, healthRoute);

export default app;

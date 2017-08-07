/* eslint-disable max-len */
import path from 'path';
import express from 'express';
import { json } from 'body-parser';
import helmet from 'helmet';
import hsts from 'hsts';
import bunyanMiddleware from 'bunyan-middleware';

import logger from './services/logger';
import createHealthRoute from './routes/health';
import createAssessmentRoute from './routes/assessment';
import createViperRoute from './routes/viper';
import createPrisonerAssessmentsRoute from './routes/assessments';
import index from './routes/index';

export default function createApp(db, appInfo, assessmentService, viperService, prisonerAssessmentsService) {
  const app = express();
  const sixtyDaysInSeconds = 5184000;

  app.use(helmet());
  app.use(hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  }));

  app.use(json());

  app.use(bunyanMiddleware({ logger }));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/health', createHealthRoute(db, appInfo));
  app.use('/api/assessment', createAssessmentRoute(assessmentService));
  app.use('/api/viper', createViperRoute(viperService));
  app.use('/api/assessments', createPrisonerAssessmentsRoute(prisonerAssessmentsService));
  app.use('/', index);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    const errorMessage = error.message || 'error';
    const errorStatus = error.status || 500;

    res.status(errorStatus);
    res.send(errorMessage);
  });

  return app;
}

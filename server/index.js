import config from '../server/config';
import createDB from '../server/db';
import createAppInfoService from '../server/services/app-info';
import createAssessmentService from '../server/services/assessment';
import createPrisonerAssessmentService from '../server/services/assessments';
import createViperService from './services/viper';
import createApp from '../server/app';

// eslint-disable-next-line import/no-unresolved
const buildInfo = config.dev ? null : require('../build-info.json');

const db = createDB();
const appInfo = createAppInfoService(buildInfo);
const assessmentService = createAssessmentService(db, appInfo);
const viperService = createViperService(db);
const prisonerAssessmentsService = createPrisonerAssessmentService(db, appInfo);
const app = createApp(db, appInfo, assessmentService, viperService, prisonerAssessmentsService);

export default app;

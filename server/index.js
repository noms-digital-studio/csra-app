import config from '../server/config';
import createDB from '../server/db';
import createAppInfoService from '../server/services/app-info';
import createAssessmentService from '../server/services/assessment';
import createApp from '../server/app';

// eslint-disable-next-line import/no-unresolved
const buildInfo = config.dev ? null : require('../build-info.json');

const db = createDB();
const appInfo = createAppInfoService(buildInfo);
const assessment = createAssessmentService(db, appInfo);
const app = createApp(db, appInfo, assessment);

export default app;

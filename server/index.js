const config = require('../server/config');
const createDB = require('../server/db');
const createAppInfoService = require('../server/services/app-info');
const createAssessmentService = require('../server/services/assessment');
const createPrisonerAssessmentService = require('../server/services/assessments');
const createViperService = require('./services/viper');
const createApp = require('../server/app');

// eslint-disable-next-line import/no-unresolved
const buildInfo = config.dev ? null : require('../build-info.json');

const db = createDB();
const appInfo = createAppInfoService(buildInfo);
const assessmentService = createAssessmentService(db, appInfo);
const viperService = createViperService(db);
const prisonerAssessmentsService = createPrisonerAssessmentService(db, appInfo);
const app = createApp(db, appInfo, assessmentService, viperService, prisonerAssessmentsService);

module.exports = app;

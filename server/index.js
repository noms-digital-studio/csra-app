import config from '../server/config';
import createDB from '../server/db';
import createAppInfo from '../server/services/app-info';
import createApp from '../server/app';

// eslint-disable-next-line import/no-unresolved
const buildInfo = config.dev ? null : require('../build-info.json');

const db = createDB();
const appInfo = createAppInfo(buildInfo);
const app = createApp(db, appInfo);

export default app;

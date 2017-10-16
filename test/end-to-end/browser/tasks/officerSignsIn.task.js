import LoginPage from '../pages/Login.page';
import DashboardPage from '../pages/Dashboard.page';
import { clearPrisonerAssessmentsSync } from '../../utils/dbClear';

const defaultConfig = {
  smokeTest: false,
  userCredentials: {
    username: process.env.TEST_USER_NAME || 'officer',
    password: process.env.TEST_USER_PASSWORD || 'password',
  },
};

function givenThatTheOfficerIsSignedIn(opts) {
  const config = { ...defaultConfig, ...opts };

  if (!config.smokeTest) {
    clearPrisonerAssessmentsSync();
  }

  expect(LoginPage.mainHeading).to.equal('Sign in');

  LoginPage.enterUsername(config.userCredentials.username);
  LoginPage.enterUserPassword(config.userCredentials.password);
  LoginPage.clickContinue();

  expect(DashboardPage.headerUsername).to.equal('John Smith');

  if (!config.smokeTest) {
    expect(DashboardPage.mainHeading).to.equal('There is no one to assess.');
  }
}

export default givenThatTheOfficerIsSignedIn;

import LoginPage from '../pages/Login.page';
import DashboardPage from '../pages/Dashboard.page';
import { clearPrisonerAssessmentsSync } from '../../utils/dbClear';

function givenThatTheOfficerIsSignedIn({ smokeTest } = {}) {
  if (!smokeTest) {
    clearPrisonerAssessmentsSync();
  }

  expect(LoginPage.mainHeading).to.equal('Sign in');
  LoginPage.enterUsername('officer');
  LoginPage.enterUserpassword('password');
  LoginPage.clickContinue();
  expect(DashboardPage.headerUsername).to.equal('John Smith');

  if (!smokeTest) {
    expect(DashboardPage.mainHeading).to.equal('There is no one to assess.');
  }
}

export default givenThatTheOfficerIsSignedIn;

import LoginPage from '../pages/Login.page';
import BeforeYouStartPage from '../pages/BeforeYouStart.page';
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
  expect(BeforeYouStartPage.headerUsername).to.equal('John Smith');
  expect(BeforeYouStartPage.mainHeading).to.equal('Cell sharing risk assessment');
  BeforeYouStartPage.clickContinue();

  if (!smokeTest) {
    expect(DashboardPage.mainHeading).to.equal('There is no one to assess.');
  }
}

export default givenThatTheOfficerIsSignedIn;

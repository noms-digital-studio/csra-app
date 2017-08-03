import LoginPage from '../pages/Login.page';
import BeforeYouStartPage from '../pages/BeforeYouStart.page';
import DashboardPage from '../pages/Dashboard.page';
import { clearPrisonerAssessmentsSync } from '../../utils/dbClear';

function givenThatTheOfficerIsSignedIn() {
  clearPrisonerAssessmentsSync();

  expect(LoginPage.mainHeading).to.equal('Your full name');
  LoginPage.enterUsername('officer1');
  LoginPage.clickContinue();
  expect(BeforeYouStartPage.headerUsername).to.equal('officer1');
  expect(BeforeYouStartPage.mainHeading).to.equal('Cell sharing risk assessment');
  BeforeYouStartPage.clickContinue();
  expect(DashboardPage.mainHeading).to.equal('There is no one to assess.');
}

export default givenThatTheOfficerIsSignedIn;

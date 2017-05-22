import LoginPage from '../pages/Login.page';
import BeforeYouStartPage from '../pages/BeforeYouStart.page';
import DashboardPage from '../pages/Dashboard.page';

function givenThatTheOfficerIsSignedIn() {
  expect(LoginPage.mainHeading).to.equal('Your full name');
  LoginPage.enterUsername('officer1');
  LoginPage.submitPage();
  expect(BeforeYouStartPage.headerUsername).to.equal('officer1');
  expect(BeforeYouStartPage.mainHeading).to.equal('Cell sharing risk assessment');
  BeforeYouStartPage.clickContinue();
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
}

export default givenThatTheOfficerIsSignedIn;

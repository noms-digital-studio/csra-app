import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import LoginPage from './pages/Login.page';

const whenTheySignOut = () => {
  browser.click('[data-element-id="sign-out"]');
};


const thenTheyShouldBeRedirectedToTheSignInPage = () => {
  expect(LoginPage.mainHeading).to.equal('Sign in');
};

const andBeUnableToProceedFurther = () => {
  browser.url('/dashboard');
  expect(LoginPage.mainHeading).to.equal('Sign in');
};


describe('Sign out', () => {
  it('signs out an signed in officer', () => {
    givenThatTheOfficerIsSignedIn();
    whenTheySignOut();
    thenTheyShouldBeRedirectedToTheSignInPage();
    andBeUnableToProceedFurther();
  });
});

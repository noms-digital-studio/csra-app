import LoginPage from './pages/Login.page';


describe('Sign in', () => {
  context('Given that the signs in with invalid credentials', () => {
    it('informs the user about the error', () => {
      expect(LoginPage.mainHeading).to.equal('Sign in');

      LoginPage.enterUsername('invalid-username');
      LoginPage.enterUserPassword('invalid-password');
      LoginPage.clickContinue();

      expect(LoginPage.mainHeading).to.equal('Sign in');

      expect(browser.getText('.error-summary')).to.include('You have entered an incorrect username or password');
    });
  });
});

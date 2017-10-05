describe('/ (homepage)', () => {
  before(() => {
    browser.url('/');
  });

  context('Given that an officer is signed out', () => {
    it('display the signin title', () => {
      expect(browser.getText('h1')).equal('Sign in');
    });

    it('displays the sign in page on the page', () => {
      expect(browser.getText('main')).to.contain('Username');
      expect(browser.getText('main')).to.contain('Password');
    });
  });
});

describe('/ (homepage)', () => {
  before(() => {
    browser.url('/');
  });

  it('display the correct page title', () => {
    expect(browser.getTitle()).equal('Sign in');
  });

  it('displays "Your full name" on the page', () => {
    expect(browser.getText('main')).to.contain('Your full name');
  });
});

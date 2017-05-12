describe('/ (homepage)', () => {
  before(() => {
    browser.url('/');
  });

  it('display the correct page title', () => {
    expect(browser.getTitle()).equal('Assess if a prisoner can share a cell safely');
    browser.pause();
  });

  it('displays "Enter your full name" on the page', () => {
    expect(browser.getText('main')).to.contain('Enter your full name');
  });
});

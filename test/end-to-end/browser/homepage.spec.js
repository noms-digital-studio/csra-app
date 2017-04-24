describe('/ (homepage)', () => {
  before(() => {
    browser.url('/');
  });

  it('display the correct page title', () => {
    expect(browser.getTitle()).equal('Assess if a prisoner can share a cell safely');
  });

  it('displays "Hello World" on the page', () => {
    expect(browser.getText('main')).equal('Hello World');
  });
});

describe('/unknown', () => {
  before(() => {
    browser.url('/unknown');
  });

  it('displays a 404 page when a resource is not found', () => {
    expect(browser.getText('main')).to.contain('Error: Page Not Found');
  });
});

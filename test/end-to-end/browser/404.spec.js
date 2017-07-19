describe('/unknown', () => {
  it('displays a 404 page when a resource is not found', () => {
    browser.url('/unknown');
    expect(browser.getText('main')).to.contain('Error: Page Not Found');
  });
});

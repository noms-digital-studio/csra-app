describe('CSRA homepage', () => {
  it('displays the health status of the app', () => {
    browser.url('/health');
    expect(browser.getText('body')).equal('{"status":"OK"}');
  });
});

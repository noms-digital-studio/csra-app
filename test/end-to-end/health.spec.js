describe('/health', () => {
  it('displays the health status of the app', () => {
    browser.url('/health');
    expect(browser.getText('body')).contain('"status":"OK"');
  });
});

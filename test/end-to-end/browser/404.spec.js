import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task'

function whenINavigateToAKnownPage(){
  browser.url('/unknown');
}

describe('/unknown', () => {
  it('displays a 404 page when a resource is not found', () => {
    givenThatTheOfficerIsSignedIn();
    whenINavigateToAKnownPage();
    expect(browser.getText('main')).to.contain('Error: Page Not Found');
  });
});

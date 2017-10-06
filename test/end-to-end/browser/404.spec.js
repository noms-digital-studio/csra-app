import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';
import Page from './pages/BasePage';

const Page404 = new Page();


function whenINavigateToAKnownPage() {
  browser.url('/unknown');
}

describe('/unknown', () => {
  it('displays a 404 page when a resource is not found', () => {
    givenThatTheOfficerIsSignedIn();
    whenINavigateToAKnownPage();
    expect(Page404.mainHeading).to.contain('Error: Page Not Found');
  });
});

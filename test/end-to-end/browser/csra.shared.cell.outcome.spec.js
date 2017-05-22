import AdminPage from './pages/Admin.page';
import DashboardPage from './pages/Dashboard.page';
import PrisonerProfilePage from './pages/PrisonerProfile.page';
import CsraConfirmationPage from './pages/CsraConfirmation.page';
import CsraCommentsPage from './pages/CsraComments.page';
import CsraYesNoPage from './pages/CsraYesNo.page';
import AssessmentCompletePage from './pages/AssessmentComplete.page';
import AssessmentConfirmationPage from './pages/AssessmentConfirmation.page';

import givenThatTheOfficerIsSignedIn from './tasks/officerSignsIn.task';

function whenALowRiskPrisonerIsAssessed() {
  DashboardPage.clickCsraStartLink();
  expect(PrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(PrisonerProfilePage.prisonerName).to.equal('John Lowe');
  PrisonerProfilePage.clickContinue();

  // 1 of 9
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain to the prisoner');
  CsraConfirmationPage.tickCheckbox();
  CsraConfirmationPage.clickContinue();

  // 2 of 9
  expect(CsraConfirmationPage.mainHeading).to.contain('Current recommendation: shared cell');
  CsraConfirmationPage.tickCheckbox();
  CsraConfirmationPage.clickContinue();

  // 3 of 9
  expect(CsraCommentsPage.mainHeading).to.contain('How do you think they feel about sharing a cell at this moment?');
  CsraCommentsPage.enterComment('sharing comment');
  CsraCommentsPage.clickContinue();

  // 4 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Have they indicated they might seriously hurt a cellmate?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // 5 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Do you think they might seriously hurt a cellmate because they\'re vulnerable?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // 6 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Are they part of a gang, or likely to join a gang in prison?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // 7 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Have they used drugs in the last month?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // 8 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Do they have any hostile views or prejudices that mean they shouldn\'t share a cell with a particular group?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // 9 of 9
  expect(CsraYesNoPage.mainHeading).to.contain('Are there any other reasons why you would recommend they have a single cell?');
  CsraYesNoPage.selectNoRadioButton();
  CsraYesNoPage.clickContinue();

  // Assessment complete
  expect(AssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(AssessmentCompletePage.recommendationText).to.equal('Recommended action: Shared Cell');
  expect(AssessmentCompletePage.name).to.equal('John Lowe');
  expect(AssessmentCompletePage.dob).to.equal('01-Oct-1970');
  expect(AssessmentCompletePage.nomisId).to.equal('A111111');
  AssessmentCompletePage.clickContinue();

  // Assessment confirmation
  expect(AssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(AssessmentConfirmationPage.outcome).to.equal('Shared Cell');
  expect(AssessmentConfirmationPage.name).to.equal('John Lowe');
  expect(AssessmentConfirmationPage.dob).to.equal('01-Oct-1970');
  expect(AssessmentConfirmationPage.nomisId).to.equal('A111111');
  AssessmentConfirmationPage.tickCheckbox();
  AssessmentConfirmationPage.clickContinue();
}

function thenTheOutcomeIsSharedCellRecomendation() {
  expect(DashboardPage.mainHeading).to.contain('Prisoners to assess on:');
  const row = browser.element('[data-profile-row]:nth-child(1)');
  expect(row.getText()).to.equal('John Lowe A111111 01-Oct-1970 Complete Start Shared Cell');
}

describe('CSRA assessment', () => {
  before(() => {
    AdminPage.visit();
    expect(AdminPage.mainHeading).to.equal('Admin');
    AdminPage.clickLoadDataButton();
    AdminPage.clickContinueButton();
  });

  it('Assesses a prisoner with a low viper score', () => {
    givenThatTheOfficerIsSignedIn();
    whenALowRiskPrisonerIsAssessed();
    thenTheOutcomeIsSharedCellRecomendation();
  });
});

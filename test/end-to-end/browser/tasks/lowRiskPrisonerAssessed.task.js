import DashboardPage from '../pages/Dashboard.page';
import CsraPrisonerProfilePage from '../pages/csra/CsraPrisonerProfile.page';
import CsraConfirmationPage from '../pages/csra/CsraConfirmation.page';
import CsraCommentsPage from '../pages/csra/CsraComments.page';
import CsraYesNoPage from '../pages/csra/CsraYesNo.page';
import CsraAssessmentCompletePage from '../pages/csra/CsraAssessmentComplete.page';
import CsraAssessmentConfirmationPage from '../pages/csra/CsraAssessmentConfirmation.page';

function whenALowRiskPrisonerIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('J1234LO');
  expect(CsraPrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(CsraPrisonerProfilePage.prisonerName).to.equal('John Lowe');

  CsraPrisonerProfilePage.clickContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain to the prisoner');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Current recommendation: shared cell');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraCommentsPage.mainHeading).to.contain('How do you think they feel about sharing a cell at this moment?');

  CsraCommentsPage.commentAndContinue('sharing comment');
  expect(CsraYesNoPage.mainHeading).to.contain('Have they indicated they might seriously hurt a cellmate?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Do you think they might seriously hurt a cellmate because they\'re vulnerable?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Are they part of a gang, or likely to join a gang in prison?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Have they used drugs in the last month?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Do they have any hostile views or prejudices that mean they shouldn\'t share a cell with a particular group?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Are there any other reasons why you would recommend they have a single cell?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraAssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(CsraAssessmentCompletePage.recommendationText).to.equal('Shared Cell');
  expect(CsraAssessmentCompletePage.name).to.equal('John Lowe');
  expect(CsraAssessmentCompletePage.dob).to.equal('01-Oct-1970');
  expect(CsraAssessmentCompletePage.nomisId).to.equal('J1234LO');

  CsraAssessmentCompletePage.clickContinue();
  expect(CsraAssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(CsraAssessmentConfirmationPage.outcome).to.equal('Shared Cell');
  expect(CsraAssessmentConfirmationPage.name).to.equal('John Lowe');
  expect(CsraAssessmentConfirmationPage.dob).to.equal('01-Oct-1970');
  expect(CsraAssessmentConfirmationPage.nomisId).to.equal('J1234LO');
}

export default whenALowRiskPrisonerIsAssessed;

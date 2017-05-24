import DashboardPage from '../pages/Dashboard.page';
import PrisonerProfilePage from '../pages/PrisonerProfile.page';
import CsraConfirmationPage from '../pages/CsraConfirmation.page';
import CsraCommentsPage from '../pages/CsraComments.page';
import CsraYesNoPage from '../pages/CsraYesNo.page';
import AssessmentCompletePage from '../pages/AssessmentComplete.page';
import AssessmentConfirmationPage from '../pages/AssessmentConfirmation.page';

function whenALowRiskPrisonerIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('J1234LO');
  expect(PrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(PrisonerProfilePage.prisonerName).to.equal('John Lowe');

  PrisonerProfilePage.clickContinue();
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
  expect(AssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(AssessmentCompletePage.recommendationText).to.equal('Shared Cell');
  expect(AssessmentCompletePage.name).to.equal('John Lowe');
  expect(AssessmentCompletePage.dob).to.equal('01-Oct-1970');
  expect(AssessmentCompletePage.nomisId).to.equal('J1234LO');

  AssessmentCompletePage.clickContinue();
  expect(AssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(AssessmentConfirmationPage.outcome).to.equal('Shared Cell');
  expect(AssessmentConfirmationPage.name).to.equal('John Lowe');
  expect(AssessmentConfirmationPage.dob).to.equal('01-Oct-1970');
  expect(AssessmentConfirmationPage.nomisId).to.equal('J1234LO');
}

export default whenALowRiskPrisonerIsAssessed;

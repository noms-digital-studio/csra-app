import DashboardPage from '../pages/Dashboard.page';
import AssessmentConfirmationPage from '../pages/AssessmentConfirmation.page';
import PrisonerProfilePage from '../pages/PrisonerProfile.page';
import CsraConfirmationPage from '../pages/CsraConfirmation.page';
import CsraCommentsPage from '../pages/CsraComments.page';
import CsraYesNoPage from '../pages/CsraYesNo.page';
import AssessmentCompletePage from '../pages/AssessmentComplete.page';

function whenAPrisonerWithNoViperIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('A444444');
  expect(PrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(PrisonerProfilePage.prisonerName).to.equal('James Neo');

  PrisonerProfilePage.clickContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain to the prisoner');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('No prisoner record');

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
  expect(AssessmentCompletePage.recommendationText).to.equal('Single Cell');
  expect(AssessmentCompletePage.name).to.equal('James Neo');
  expect(AssessmentCompletePage.dob).to.equal('03-Dec-1958');
  expect(AssessmentCompletePage.nomisId).to.equal('A444444');

  AssessmentCompletePage.clickContinue();
  expect(AssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(AssessmentConfirmationPage.outcome).to.equal('Single Cell');
  expect(AssessmentConfirmationPage.name).to.equal('James Neo');
  expect(AssessmentConfirmationPage.dob).to.equal('03-Dec-1958');
  expect(AssessmentConfirmationPage.nomisId).to.equal('A444444');
}

export default whenAPrisonerWithNoViperIsAssessed;

import DashboardPage from '../pages/Dashboard.page';
import CsraAssessmentConfirmationPage from '../pages/csra/CsraAssessmentConfirmation.page';
import CsraPrisonerProfilePage from '../pages/csra/CsraPrisonerProfile.page';
import CsraConfirmationPage from '../pages/csra/CsraConfirmation.page';
import CsraCommentsPage from '../pages/csra/CsraComments.page';
import CsraYesNoPage from '../pages/csra/CsraYesNo.page';
import CsraAssessmentCompletePage from '../pages/csra/CsraAssessmentComplete.page';

function whenAPrisonerWithNoViperIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('J6285NE');
  expect(CsraPrisonerProfilePage.mainHeading).to.contain('Confirm identity');
  expect(CsraPrisonerProfilePage.prisonerName).to.equal('James Neo');

  CsraPrisonerProfilePage.clickContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain this');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('No prisoner record');

  CsraConfirmationPage.clickContinue();
  expect(CsraCommentsPage.mainHeading).to.contain('How do you think they feel about sharing a cell at this moment?');

  CsraCommentsPage.commentAndContinue('sharing comment');
  expect(CsraYesNoPage.mainHeading).to.contain('Is there any indication they might seriously hurt a cellmate?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Do you think they\'re vulnerable?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Are they part of a gang, or likely to join a gang in prison?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Have they used drugs in the last month?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Do they have any hostile views or prejudices about a particular group?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraYesNoPage.mainHeading).to.contain('Are there any other reasons why you would recommend they have a single cell?');

  CsraYesNoPage.clickNoAndContinue();
  expect(CsraAssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(CsraAssessmentCompletePage.recommendationText).to.equal('Single Cell');
  expect(CsraAssessmentCompletePage.name).to.equal('James Neo');
  expect(CsraAssessmentCompletePage.dob).to.equal('03-Dec-1958');
  expect(CsraAssessmentCompletePage.nomisId).to.equal('J6285NE');

  CsraAssessmentCompletePage.clickContinue();
  expect(CsraAssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(CsraAssessmentConfirmationPage.outcome).to.equal('Single Cell');
  expect(CsraAssessmentConfirmationPage.name).to.equal('James Neo');
  expect(CsraAssessmentConfirmationPage.dob).to.equal('03-Dec-1958');
  expect(CsraAssessmentConfirmationPage.nomisId).to.equal('J6285NE');
}

export default whenAPrisonerWithNoViperIsAssessed;

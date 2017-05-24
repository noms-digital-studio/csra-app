import PrisonerProfilePage from '../pages/PrisonerProfile.page';
import CsraConfirmationPage from '../pages/CsraConfirmation.page';
import DashboardPage from '../pages/Dashboard.page';
import AssessmentCompletePage from '../pages/AssessmentComplete.page';
import AssessmentConfirmationPage from '../pages/AssessmentConfirmation.page';

function whenAViolentPrisonerIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('A333333');
  expect(PrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(PrisonerProfilePage.prisonerName).to.equal('Ian Rate');

  PrisonerProfilePage.clickContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain to the prisoner');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Current recommendation: single cell');

  CsraConfirmationPage.confirmAndContinue();
  expect(AssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(AssessmentCompletePage.recommendationText).to.equal('Single Cell');
  expect(AssessmentCompletePage.name).to.equal('Ian Rate');
  expect(AssessmentCompletePage.dob).to.equal('23-Mar-1988');
  expect(AssessmentCompletePage.nomisId).to.equal('A333333');

  AssessmentCompletePage.clickContinue();
  expect(AssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(AssessmentConfirmationPage.outcome).to.equal('Single Cell');
  expect(AssessmentConfirmationPage.name).to.equal('Ian Rate');
  expect(AssessmentConfirmationPage.dob).to.equal('23-Mar-1988');
  expect(AssessmentConfirmationPage.nomisId).to.equal('A333333');
}

export default whenAViolentPrisonerIsAssessed;

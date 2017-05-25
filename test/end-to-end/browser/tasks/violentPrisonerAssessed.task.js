import CsraPrisonerProfilePage from '../pages/csra/CsraPrisonerProfile.page';
import CsraConfirmationPage from '../pages/csra/CsraConfirmation.page';
import DashboardPage from '../pages/Dashboard.page';
import CsraAssessmentCompletePage from '../pages/csra/CsraAssessmentComplete.page';
import CsraAssessmentConfirmationPage from '../pages/csra/CsraAssessmentConfirmation.page';

function whenAViolentPrisonerIsAssessed() {
  DashboardPage.clickCsraStartLinkForNomisId('I9876RA');
  expect(CsraPrisonerProfilePage.mainHeading).to.contain('Confirm prisoner identity and begin assessment');
  expect(CsraPrisonerProfilePage.prisonerName).to.equal('Ian Rate');

  CsraPrisonerProfilePage.clickContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Explain to the prisoner');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraConfirmationPage.mainHeading).to.contain('Current recommendation: single cell');

  CsraConfirmationPage.confirmAndContinue();
  expect(CsraAssessmentCompletePage.mainHeading).to.contain('Assessment Complete');
  expect(CsraAssessmentCompletePage.recommendationText).to.equal('Single Cell');
  expect(CsraAssessmentCompletePage.name).to.equal('Ian Rate');
  expect(CsraAssessmentCompletePage.dob).to.equal('23-Mar-1988');
  expect(CsraAssessmentCompletePage.nomisId).to.equal('I9876RA');

  CsraAssessmentCompletePage.clickContinue();
  expect(CsraAssessmentConfirmationPage.mainHeading).to.contain('Assessment confirmation');
  expect(CsraAssessmentConfirmationPage.outcome).to.equal('Single Cell');
  expect(CsraAssessmentConfirmationPage.name).to.equal('Ian Rate');
  expect(CsraAssessmentConfirmationPage.dob).to.equal('23-Mar-1988');
  expect(CsraAssessmentConfirmationPage.nomisId).to.equal('I9876RA');
}

export default whenAViolentPrisonerIsAssessed;

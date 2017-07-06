import FullAssessmentOutcomePage from '../pages/FullAssessmentOutcome.page';
import DashboardPage from '../pages/Dashboard.page';


function viewFullOutcomeForLowRiskPrisoner({
  riskRecommendation,
  healthRecommendation,
  finalRecommendation,
}) {
  DashboardPage.clickViewFullOutcomeForNomisId('J1234LO');

  expect(
    FullAssessmentOutcomePage.waitForMainHeadingWithDataId('full-outcome'),
  ).to.equal('Risk and healthcare assessment outcome');
  expect(FullAssessmentOutcomePage.name).to.equalIgnoreCase('John Lowe');
  expect(FullAssessmentOutcomePage.dob).to.equalIgnoreCase('01-10-1970');
  expect(FullAssessmentOutcomePage.nomisId).to.equalIgnoreCase('J1234LO');

  expect(FullAssessmentOutcomePage.recommendOutcome).to.match(new RegExp(finalRecommendation, 'i'));
  expect(FullAssessmentOutcomePage.riskRecommendation).to.match(new RegExp(riskRecommendation, 'i'));
  expect(FullAssessmentOutcomePage.healthRecommendation).to.match(new RegExp(healthRecommendation, 'i'));

  FullAssessmentOutcomePage.clickContinue();
  expect(DashboardPage.mainHeading).to.contain('Assessments on:');
  const row = browser.element('[data-profile-row=J1234LO]');
  expect(row.getText()).to.equalIgnoreCase(`John Lowe J1234LO 01-10-1970 Complete Complete ${finalRecommendation} View`);
}


export default viewFullOutcomeForLowRiskPrisoner;

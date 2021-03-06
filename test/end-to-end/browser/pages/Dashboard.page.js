/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class DashboardPage extends BasePage {
  clickAddPrisoner() {
    browser.click('[data-element-id="add-assessment"]');
  }

  startRiskAssessmentFor(nomisId) {
    browser.click(`[data-element-id="start-csra-link-${nomisId}"]`);
  }

  viewCompletedRiskAssessmentFor(nomisId) {
    browser.click(`[data-element-id="completed-csra-link-${nomisId}"]`);
  }

  viewCompletedHealthcareAssessmentFor(nomisId) {
    browser.click(`[data-element-id="completed-healthcare-link-${nomisId}"]`);
  }

  startHealthcareAssessmentFor(nomisId) {
    browser.click(`[data-element-id="start-healthcare-link-${nomisId}"]`);
  }

  viewFullOutcomeFor(nomisId) {
    browser.click(`[data-element-id="view-outcome-link-${nomisId}"]`);
  }
}

export default new DashboardPage();

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class DashboardPage extends BasePage {
  clickAddPrisoner() { this.clickContinue(); }

  clickRiskAssessmentStartLinkForNomisId(nomisId) {
    browser.click(`[data-element-id="start-csra-link-${nomisId}"]`);
  }

  clickHealthcareStartLinkForNomisId(nomisId) {
    browser.click(`[data-element-id="start-healthcare-link-${nomisId}"]`);
  }

  clickViewFullOutcomeForNomisId(nomisId) {
    browser.click(`[data-element-id="view-outcome-link-${nomisId}"]`);
  }
}

export default new DashboardPage();

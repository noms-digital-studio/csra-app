/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class DashboardPage extends BasePage {
  clickAddPrisoner() { browser.click('[data-continue-button]'); }

  clickRiskAssessmentStartLinkForNomisId(nomisId) {
    browser.click(`[data-start-csra-link=${nomisId}]`);
  }

  clickHealthcareStartLinkForNomisId(nomisId) {
    browser.click(`[data-start-healthcare-link=${nomisId}]`);
  }

  clickViewFullOutcomeForNomisId(nomisId) {
    browser.click(`[data-cell-view-outcome-link=${nomisId}]`);
  }
}

export default new DashboardPage();

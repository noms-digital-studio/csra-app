/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentSummary extends BasePage {
  get outcome() {
    return browser.getText('[data-element-id="risk-assessment-outcome"]');
  }

  get initialFeelings() {
    return browser.getText('[data-element-id="risk-assessment-feeling"] [data-element-id="row-answer"]');
  }

  get harm() {
    return browser.getText('[data-element-id="risk-assessment-harm"] [data-element-id="row-answer"]');
  }

  get vulnerability() {
    return browser.getText('[data-element-id="risk-assessment-vulnerability"] [data-element-id="row-answer"]');
  }

  get gang() {
    return browser.getText('[data-element-id="risk-assessment-gang"] [data-element-id="row-answer"]');
  }

  get narcotics() {
    return browser.getText('[data-element-id="risk-assessment-narcotics"] [data-element-id="row-answer"]');
  }

  get prejudice() {
    return browser.getText('[data-element-id="risk-assessment-prejudice"] [data-element-id="row-answer"]');
  }

  get officerComments() {
    return browser.getText('[data-element-id="risk-assessment-officer-comments"] [data-element-id="row-answer"]');
  }
}

export default new RiskAssessmentSummary();

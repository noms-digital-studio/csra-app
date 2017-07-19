/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentSummary extends BasePage {
  get outcome() {
    return browser.getText('[data-element-id="risk-assessment-outcome"]');
  }

  get initialFeelings() {
    return browser.getText('[data-element-id="risk-assessment-feeling"]');
  }

  get harm() {
    return browser.getText('[data-element-id="risk-assessment-harm"]');
  }

  get vulnerability() {
    return browser.getText('[data-element-id="risk-assessment-vulnerability"]');
  }

  get gang() {
    return browser.getText('[data-element-id="risk-assessment-gang"]');
  }

  get narcotics() {
    return browser.getText('[data-element-id="risk-assessment-narcotics"]');
  }

  get prejudice() {
    return browser.getText('[data-element-id="risk-assessment-prejudice"]');
  }

  get officerComments() {
    return browser.getText('[data-element-id="risk-assessment-officer-comments"]');
  }
}

export default new RiskAssessmentSummary();

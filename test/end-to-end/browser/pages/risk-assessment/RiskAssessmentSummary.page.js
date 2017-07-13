/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentSummary extends BasePage {
  get name() {
    return browser.getText('[data-prisoner-name]');
  }
  get dob() {
    return browser.getText('[data-prisoner-dob]');
  }
  get nomisId() {
    return browser.getText('[data-prisoner-nomis-id]');
  }

  get outcome() {
    return browser.getText('[data-risk-assessment-outcome]');
  }

  get initialFeelings() {
    return browser.getText('[data-risk-assessment-feeling]');
  }

  get harm() {
    return browser.getText('[data-risk-assessment-harm]');
  }

  get vulnerability() {
    return browser.getText('[data-risk-assessment-vulnerability]');
  }

  get gang() {
    return browser.getText('[data-risk-assessment-gang]');
  }

  get narcotics() {
    return browser.getText('[data-risk-assessment-narcotics]');
  }

  get prejudice() {
    return browser.getText('[data-risk-assessment-prejudice]');
  }

  get officerComments() {
    return browser.getText('[data-risk-assessment-officer-comments]');
  }

  clickContinue() {
    browser.click('[data-continue-button]');
  }

  submitForm() {
    browser.submitForm('#rsa-form');
  }
}

export default new RiskAssessmentSummary();

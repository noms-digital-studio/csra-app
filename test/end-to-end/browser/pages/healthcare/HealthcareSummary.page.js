/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class HealthcareSummary extends BasePage {
  get name() {
    return browser.getText('[data-prisoner-name]');
  }
  get dob() {
    return browser.getText('[data-prisoner-dob]');
  }
  get nomisId() {
    return browser.getText('[data-prisoner-nomis-id]');
  }

  get assessor() {
    return browser.getText('[data-assessor]');
  }
  get role() {
    return browser.getText('[data-role]');
  }
  get date() {
    return browser.getText('[data-date]');
  }

  get outcome() {
    return browser.getText('[data-outcome]');
  }
  get comments() {
    return browser.getText('[data-comments]');
  }
  get consent() {
    return browser.getText('[data-consent]');
  }

  clickChange() {
    browser.click('[data-change-consent-link]');
  }

  submitForm() {
    browser.submitForm('#hc-form');
  }
}

export default new HealthcareSummary();

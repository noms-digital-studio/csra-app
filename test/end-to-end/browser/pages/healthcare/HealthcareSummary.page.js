/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class HealthcareSummary extends BasePage {
  get name() {
    return browser.getText('[data-element-id="prisoner-name"]');
  }
  get dob() {
    return browser.getText('[data-element-id="prisoner-dob"]');
  }
  get nomisId() {
    return browser.getText('[data-element-id="nomis-id"]');
  }

  get assessor() {
    return browser.getText('[data-element-id="healthcare-assessor"]');
  }
  get role() {
    return browser.getText('[data-element-id="healthcare-role"]');
  }
  get date() {
    return browser.getText('[data-element-id="healthcare-date"]');
  }

  get outcome() {
    return browser.getText('[data-element-id="healthcare-outcome"]');
  }
  get comments() {
    return browser.getText('[data-element-id="healthcare-comments"]');
  }
  get consent() {
    return browser.getText('[data-element-id="healthcare-consent"]');
  }

  clickChange() {
    browser.click('[data-element-id="healthcare-change-consent-link"]');
  }
}

export default new HealthcareSummary();

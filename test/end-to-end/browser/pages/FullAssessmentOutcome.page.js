/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';


class FullAssessmentOutcomePage extends BasePage {
  get name() {
    return browser.getText('[data-element-id="prisoner-name"]');
  }

  get dob() {
    return browser.getText('[data-element-id="prisoner-dob"]');
  }

  get nomisId() {
    return browser.getText('[data-element-id="nomis-id"]');
  }

  get riskRecommendation() {
    return browser.getText('[data-element-id="risk-assessment-outcome"]');
  }

  get recommendOutcome() {
    return browser.getText('[data-element-id="recommended-outcome"]');
  }

  get healthRecommendation() {
    return browser.getText('[data-element-id="healthcare-outcome"]');
  }

  clickCheckbox() {
    browser.click('[data-element-id="confirm-checkbox"]');
  }

}

export default new FullAssessmentOutcomePage();

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';


class FullAssessmentOutcomePage extends BasePage {
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

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';


class FullAssessmentOutcomePage extends BasePage {
  get recommendOutcome() {
    return browser.getText('[data-element-id="recommended-outcome"]');
  }

  clickCheckbox() {
    browser.click('[data-element-id="confirm-checkbox"]');
  }
}

export default new FullAssessmentOutcomePage();

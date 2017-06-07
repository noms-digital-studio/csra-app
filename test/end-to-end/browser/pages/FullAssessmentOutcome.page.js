/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';


class FullAssessmentOutcomePage extends BasePage {
  get name() {
    return browser.getText('[data-prisoner-name]');
  }

  get dob() {
    return browser.getText('[data-prisoner-dob]');
  }

  get nomisId() {
    return browser.getText('[data-prisoner-nomis-id]');
  }

  get recommendation() {
    return browser.getText('[data-risk-assessment-outcome]');
  }

  clickCheckbox() {
    browser.click('[data-confirm-checkbox]');
  }

}

export default new FullAssessmentOutcomePage();

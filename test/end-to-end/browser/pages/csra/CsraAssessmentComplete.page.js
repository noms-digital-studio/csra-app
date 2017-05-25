/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class AssessmentCompletePage extends BasePage {
  get recommendationText() { return browser.getText('[data-recommended-action]'); }
  get name() { return browser.getText('[data-prisoner-name]'); }
  get dob() { return browser.getText('[data-prisoner-dob]'); }
  get nomisId() { return browser.getText('[data-prisoner-nomis-id]'); }

  clickContinue() { browser.click('[data-continue-button]'); }
}

export default new AssessmentCompletePage();

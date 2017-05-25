/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class AssessmentConfirmationPage extends BasePage {
  get outcome() { return browser.getText('[data-outcome]'); }
  get name() { return browser.getText('[data-prisoner-name]'); }
  get dob() { return browser.getText('[data-prisoner-dob]'); }
  get nomisId() { return browser.getText('[data-prisoner-nomis-id]'); }

  clickContinue() { browser.click('[data-continue-button]'); }
  clickCheckbox() { browser.click('[data-confirm-checkbox]'); }

  clickConfirmAndContinue() {
    this.clickCheckbox();
    this.clickContinue();
  }
}

export default new AssessmentConfirmationPage();

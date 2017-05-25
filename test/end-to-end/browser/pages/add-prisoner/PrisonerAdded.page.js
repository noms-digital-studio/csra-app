/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class PrisonerAddedPage extends BasePage {
  get name() { return browser.getText('[data-prisoner-name]'); }
  get dob() { return browser.getText('[data-prisoner-dob]'); }
  get nomisId() { return browser.getText('[data-prisoner-nomis-id]'); }

  clickConfirm() { browser.click('[data-confirm-button]'); }
}

export default new PrisonerAddedPage();

/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class PrisonerAddedPage extends BasePage {
  get name() {
    return browser.getText('[data-prisoner-name]');
  }
  get dob() {
    return browser.getText('[data-prisoner-dob]');
  }
  get nomisId() {
    return browser.getText('[data-prisoner-nomis-id]');
  }
}

export default new PrisonerAddedPage();

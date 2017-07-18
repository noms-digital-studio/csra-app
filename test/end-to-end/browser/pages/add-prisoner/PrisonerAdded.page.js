/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class PrisonerAddedPage extends BasePage {
  get name() {
    return browser.getText('[data-element-id="prisoner-name"]');
  }
  get dob() {
    return browser.getText('[data-element-id="prisoner-dob"]');
  }
  get nomisId() {
    return browser.getText('[data-element-id="nomis-id"]');
  }
}

export default new PrisonerAddedPage();

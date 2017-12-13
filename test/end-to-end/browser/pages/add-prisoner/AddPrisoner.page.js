/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class AddPrisonerPage extends BasePage {
  search(value) {
    browser.setValue('[data-element-id="query"]', value);
  }
}

export default new AddPrisonerPage();

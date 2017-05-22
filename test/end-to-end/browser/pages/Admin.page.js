/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class AdminPage extends BasePage {

  visit() { browser.url('/admin'); }

  clickLoadDataButton() {
    browser.click('[data-load-data-button]');
  }

  clickContinueButton() {
    browser.click('[data-continue]');
  }
}

export default new AdminPage();


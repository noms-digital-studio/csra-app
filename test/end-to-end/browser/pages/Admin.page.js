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

  clickClearButton() {
    browser.click('[data-clear-button]');
  }

  loadTestUsers() {
    this.clickLoadDataButton();
    this.clickContinueButton();
  }
}

export default new AdminPage();


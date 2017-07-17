/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class AdminPage extends BasePage {

  visit() { browser.url('/admin'); }

  clickLoadDataButton() {
    browser.click('[data-load-data-button]');
  }

  clickClearButton() {
    browser.click('[data-clear-button]');
  }

  loadTestUsers() {
    this.clickLoadDataButton();
    this.clickContinue();
  }
}

export default new AdminPage();


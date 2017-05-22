/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class DashboardPage extends BasePage {
  clickAddPrisoner() { browser.click('[data-add-prisoner-button]'); }

  clickCsraStartLink() {
    browser.click('[data-start-csra-link]');
  }
}

export default new DashboardPage();

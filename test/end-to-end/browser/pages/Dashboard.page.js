/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class DashboardPage extends BasePage {
  clickAddPrisoner() { browser.click('[data-add-prisoner-button]'); }

  clickCsraStartLinkForNomisId(nomisId) {
    browser.click(`[data-start-csra-link=${nomisId}]`);
  }
}

export default new DashboardPage();
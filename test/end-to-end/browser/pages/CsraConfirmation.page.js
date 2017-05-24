/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CsraConfirmationPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }
  clickCheckbox() { browser.click('[data-confirm-checkbox]'); }

  confirmAndContinue() {
    this.clickCheckbox();
    this.clickContinue();
  }

}

export default new CsraConfirmationPage();

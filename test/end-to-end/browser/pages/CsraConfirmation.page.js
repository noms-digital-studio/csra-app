/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CsraConfirmationPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }
  tickCheckbox() { browser.click('[data-confirm-checkbox]'); }
}

export default new CsraConfirmationPage();

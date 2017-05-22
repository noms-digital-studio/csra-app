/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CsraYesNoPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }

  // TODO work out how to select yes or no
  selectYesRadioButton() { browser.click('[data-yes-no-radio-group]'); }
  selectNoRadioButton() { browser.click('#radio-no'); }
}

export default new CsraYesNoPage();

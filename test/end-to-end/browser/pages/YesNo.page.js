/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class YesNoPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }
  selectYesRadioButton() { browser.click('#radio-yes'); }
  selectNoRadioButton() { browser.click('#radio-no'); }

  clickNoAndContinue() {
    this.selectNoRadioButton();
    this.clickContinue();
  }

  clickYesAndContinue() {
    this.selectYesRadioButton();
    this.clickContinue();
  }
}

export default YesNoPage;

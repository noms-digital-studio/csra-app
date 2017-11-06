/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class YesNoPage extends BasePage {
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

  enterComment(comment) {
    browser.setValue('[data-element="reason-for-answer"]', comment);
  }
}

export default YesNoPage;

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class BeforeYouStartPage extends BasePage {
  clickContinue() { browser.click('[data-before-you-start-button]'); }
}

export default new BeforeYouStartPage();

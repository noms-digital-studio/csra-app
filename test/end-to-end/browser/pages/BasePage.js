/* eslint-disable class-methods-use-this */
class BasePage {

  get mainHeading() {
    browser.waitForVisible('h1', 5000);
    return browser.getText('h1');
  }

  get form() {
    return browser.element('.form');
  }

  get headerUsername() {
    return browser.getText('[data-header-username]');
  }

  waitForMainHeadingWithDataId(id) {
    browser.waitForVisible(`[data-title="${id}"]`, 5000);
    return browser.getText('h1');
  }

  clickContinue() {
    browser.click('[data-element-id="continue-button"]');
  }
}

export default BasePage;

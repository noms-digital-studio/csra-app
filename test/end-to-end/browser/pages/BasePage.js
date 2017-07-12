/* eslint-disable class-methods-use-this */
class BasePage {

  get mainHeading() { return browser.getText('h1'); }
  waitForMainHeadingWithDataId(id) {
    browser.waitForVisible(`[data-title="${id}"]`, 5000);
    return browser.getText('h1');
  }
  get form() { return browser.element('.form'); }
  get headerUsername() { return browser.getText('[data-header-username]'); }

  submitPage() { this.form.submitForm(); }
  clickContinue() { browser.click('[data-continue-button]'); }
}

export default BasePage;

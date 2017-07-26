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

  get prisonerName() {
    return browser.getText('[data-element-id="prisoner-name"]');
  }

  get prisonerDob() {
    return browser.getText('[data-element-id="prisoner-dob"]');
  }

  get prisonerNomisId() {
    return browser.getText('[data-element-id="prisoner-nomis-id"]');
  }

  waitForMainHeadingWithDataId(id) {
    browser.waitForVisible(`[data-title="${id}"]`, 5000);
    return browser.getText('h1');
  }

  clickContinue() {
    browser.click('[data-element-id="continue-button"]');
  }

  confirmAndContinue() {
    this.clickCheckbox();
    this.clickContinue();
  }
}

export default BasePage;

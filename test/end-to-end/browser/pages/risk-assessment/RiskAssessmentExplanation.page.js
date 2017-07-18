/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentExplanationPage extends BasePage {
  clickCheckbox() {
    browser.click('[data-element-id="confirm-checkbox"]');
  }

  confirmAndContinue() {
    this.clickCheckbox();
    this.clickContinue();
  }
}

export default new RiskAssessmentExplanationPage();

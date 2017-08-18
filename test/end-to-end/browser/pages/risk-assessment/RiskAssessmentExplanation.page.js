/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentExplanationPage extends BasePage {
  clickCheckbox() {
    browser.click('[data-element-id="confirm-checkbox"]');
  }

  get viperHeading() {
    return browser.getText('[data-element-id="viper-found"]');
  }
}

export default new RiskAssessmentExplanationPage();

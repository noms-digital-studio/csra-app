/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class RiskAssessmentPrisonerProfile extends BasePage {
  get prisonerName() { return browser.getText('[data-prisoner-name]'); }

  clickContinue() { browser.click('[data-continue-button]'); }
}

export default new RiskAssessmentPrisonerProfile();

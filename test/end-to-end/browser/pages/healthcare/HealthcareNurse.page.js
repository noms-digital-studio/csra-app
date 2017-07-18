/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class HealthcareNursePage extends BasePage {

  enterRole(role) {
    browser.setValue('[data-element-id="role"]', role);
  }

  enterName(name) {
    browser.setValue('[data-element-id="full-name"]', name);
  }

  enterDate(day, month, year) {
    browser.setValue('[data-element-id="day"]', day);
    browser.setValue('[data-element-id="month"]', month);
    browser.setValue('[data-element-id="year"]', year);
  }

}

export default new HealthcareNursePage();

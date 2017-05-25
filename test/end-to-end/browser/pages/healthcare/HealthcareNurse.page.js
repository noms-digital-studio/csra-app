/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class HealthcareNursePage extends BasePage {

  enterRole(role) {
    browser.setValue('[data-role]', role);
  }

  enterName(name) {
    browser.setValue('[data-name]', name);
  }

  enterDate(day, month, year) {
    browser.setValue('[data-day]', day);
    browser.setValue('[data-month]', month);
    browser.setValue('[data-year]', year);
  }

}

export default new HealthcareNursePage();

/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class AddPrisonerPage extends BasePage {
  enterName(forename, surname) {
    browser.setValue('[data-element-id="first-name"]', forename);
    browser.setValue('[data-element-id="last-name"]', surname);
  }

  enterDoB(day, month, year) {
    browser.setValue('[data-element-id="dob-day"]', day);
    browser.setValue('[data-element-id="dob-month"]', month);
    browser.setValue('[data-element-id="dob-year"]', year);
  }

  enterNomisId(id) {
    browser.setValue('[data-element-id="nomis-id"]', id);
  }
}

export default new AddPrisonerPage();

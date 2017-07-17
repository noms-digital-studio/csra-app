/* eslint-disable class-methods-use-this */
import BasePage from '../BasePage';

class AddPrisonerPage extends BasePage {
  enterName(forename, surname) {
    browser.setValue('[data-first-name]', forename);
    browser.setValue('[data-last-name]', surname);
  }

  enterDoB(day, month, year) {
    browser.setValue('[data-dob-day]', day);
    browser.setValue('[data-dob-month]', month);
    browser.setValue('[data-dob-year]', year);
  }

  enterNomisId(id) {
    browser.setValue('[data-nomis-id]', id);
  }
}

export default new AddPrisonerPage();

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class LoginPage extends BasePage {
  get username() { return browser.element('[data-username]'); }
  enterUsername(name) { browser.setValue('[data-username]', name); }
}

class BeforeYouStartPage extends BasePage {
  clickContinue() { browser.click('[data-before-you-start-button]'); }
}

class Dashboard extends BasePage {
  clickAddPrisoner() { browser.click('[data-add-prisoner-button]'); }
}

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

  enterNomisId(id) { browser.setValue('[data-nomis-id]', id); }

  clickAddPrisonerButton() { browser.click('[data-add-prisoner-button]'); }
}

class PrisonerAddedPage extends BasePage {
  get name() { return browser.getText('[data-prisoner-name]'); }
  get dob() { return browser.getText('[data-prisoner-dob]'); }
  get nomisId() { return browser.getText('[data-prisoner-nomis-id]'); }

  clickConfirm() { browser.click('[data-confirm-button]'); }
}

export { LoginPage, BeforeYouStartPage, Dashboard, AddPrisonerPage, PrisonerAddedPage };

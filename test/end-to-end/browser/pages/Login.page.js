/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class LoginPage extends BasePage {
  get username() { return browser.element('[data-username]'); }
  enterUsername(name) { browser.setValue('[data-username]', name); }
}

export default new LoginPage();

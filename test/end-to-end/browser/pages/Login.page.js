/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class LoginPage extends BasePage {
  get username() { return browser.element('[data-element-id="username"]'); }
  enterUsername(name) { browser.setValue('[data-element-id="username"]', name); }
}

export default new LoginPage();

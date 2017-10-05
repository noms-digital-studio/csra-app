/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class LoginPage extends BasePage {
  get username() { return browser.element('[data-element-id="username"]'); }
  enterUsername(name) { browser.setValue('[data-element-id="username"]', name); }
  enterUserpassword(password) { browser.setValue('[data-element-id="password"]', password); }
}

export default new LoginPage();

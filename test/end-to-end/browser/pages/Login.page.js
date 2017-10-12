/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class LoginPage extends BasePage {
  enterUsername(name) { browser.setValue('[data-element-id="username"]', name); }
  enterUserPassword(password) { browser.setValue('[data-element-id="password"]', password); }
}

export default new LoginPage();

/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CsraCommentsPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }
  enterComment(commentText) { browser.setValue('[data-comments-textbox]', commentText); }
}

export default new CsraCommentsPage();

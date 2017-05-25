/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CommentsPage extends BasePage {
  clickContinue() { browser.click('[data-continue-button]'); }
  enterComment(commentText) { browser.setValue('[data-comments-textbox]', commentText); }

  commentAndContinue(commentText) {
    this.enterComment(commentText);
    this.clickContinue();
  }
}

export default CommentsPage;

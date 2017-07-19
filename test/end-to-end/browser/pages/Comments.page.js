/* eslint-disable class-methods-use-this */
import BasePage from './BasePage';

class CommentsPage extends BasePage {
  enterComment(commentText) { browser.setValue('[data-element-id="healthcare-comments-textbox"]', commentText); }

  commentAndContinue(commentText) {
    this.enterComment(commentText);
    this.clickContinue();
  }
}

export default CommentsPage;

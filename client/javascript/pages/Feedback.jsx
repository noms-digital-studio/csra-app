import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import SelectableInputGroup from '../components/SelectableInputGroup';
import CommentBox from '../components/CommentBox';
import Notice from '../components/Notice';

import Routes from '../constants/routes';

class Feedback extends Component {
  handleSubmit(e) {
    e.preventDefault();
    hashHistory.push(Routes.FEEDBACK_CONFIRMATION);
  }

  render() {
    return (
      <div className="">
        <h1 className="heading-xlarge">Your Feedback</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="heading-small" htmlFor="any-issues">
              Did you have any difficulties with this service?
            </label>
            <div className="grid-row u-margin-bottom-default u-margin-top-default">
              <div className="column-two-thirds">
                <Notice text="Don't include personal or financial information, eg your National Insurance number or credit card details." />
              </div>
            </div>
            <CommentBox name="any-issues" limit={300} />
          </div>
          <div className="form-group">
            <label className="heading-small" htmlFor="any-improvements">
              Do you have any ideas for how it could be improved?
            </label>

            <div className="grid-row u-margin-bottom-default u-margin-top-default">
              <div className="column-two-thirds">
                <Notice text="Don't include personal or financial information, eg your National Insurance number or credit card details." />
              </div>
            </div>
            <CommentBox name="any-improvements" limit={300} />

          </div>
          <div className="form-group">
            <label className="heading-small u-margin-bottom-default u-d-block">
              Overall, how did you feel about the service you received today?
            </label>
            <SelectableInputGroup
              type="radio"
              fields={[
                {
                  value: 'very satisfied',
                  text: 'Very Satisfied',
                  name: 'satisfaction',
                  required: false,
                },
                {
                  value: 'satisfied',
                  text: 'Satisfied',
                  name: 'satisfaction',
                  required: false,
                },
                {
                  value: 'neither satisfied or dissatisfied',
                  text: 'Neither satisfied or dissatisfied',
                  name: 'satisfaction',
                  required: false,
                },
                {
                  value: 'dissatisfied',
                  text: 'Dissatisfied',
                  name: 'satisfaction',
                  required: false,
                },
                {
                  value: 'very dissatisfied',
                  text: 'Very dissatisfied',
                  name: 'satisfaction',
                  required: false,
                },
              ]}
            />
          </div>

          <div className="form-group u-margin-bottom-large">
            <label className="heading-small u-margin-bottom-default u-d-block">
              Did you have any help filling in this form?
            </label>
            <SelectableInputGroup
              type="radio"
              fields={[
                {
                  value: 'no help',
                  text: 'No, I filled this form myself',
                  name: 'help_filling_form',
                  required: false,
                },
                {
                  value: 'computer difficulty',
                  text: 'I have difficulty using computers so someone filled in this form for me',
                  name: 'help_filling_form',
                  required: false,
                },
                {
                  value: 'used accessibility tool',
                  text: 'I used an accessibility tool such as a screen reader',
                  name: 'help_filling_form',
                  required: false,
                },
                {
                  value: 'some help',
                  text: 'I had some other kind of help',
                  name: 'help_filling_form',
                  required: false,
                },
              ]}
            />
          </div>
          <input type="submit" className="button" value="Send feedback" />
        </form>
      </div>
    );
  }
}

export default Feedback;

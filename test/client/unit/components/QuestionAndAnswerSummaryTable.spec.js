import React from 'react';
import { shallow, mount } from 'enzyme';

import QuestionAndAnswerSummaryTable
  from '../../../../client/javascript/components/QuestionAndAnswerSummaryTable';
import QuestionAnswerRow
  from '../../../../client/javascript/components/QuestionAnswerRow';

describe('<QuestionAndAnswerSummaryTable/>', () => {
  it('renders a title', () => {
    const wrapper = shallow(<QuestionAndAnswerSummaryTable title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders a list of question answers', () => {
    const questionAnswers = [
      {
        question: 'foo-question',
        answer: { answer: 'foo-answer' },
        dataTags: { 'data-foo': 'string' },
      },
      {
        question: 'bar-question',
        answer: { answer: 'bar-answer' },
        dataTags: { 'data-bar': 'string', 'data-foo-bar': 'string' },
      },
    ];
    const wrapper = mount(
      <QuestionAndAnswerSummaryTable questionsAnswers={questionAnswers} />,
    );

    const rows = wrapper.find(QuestionAnswerRow);

    questionAnswers.forEach((qNa, index) => {
      const row = rows.at(index);
      const rowHTML = row.html();
      const dataTags = Object.keys(qNa.dataTags);

      dataTags.forEach(tag => expect(rowHTML).to.match(new RegExp(tag, 'i')));

      expect(rowHTML).to.match(new RegExp(qNa.answer.answer, 'i'));
      expect(rowHTML).to.match(new RegExp(qNa.question, 'i'));
    });
  });
});

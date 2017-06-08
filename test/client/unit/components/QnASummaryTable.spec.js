import React from 'react';
import { shallow, mount } from 'enzyme';

import QnASummaryTable
  from '../../../../client/javascript/components/QnASummaryTable';
import QuestionAnswerRow
  from '../../../../client/javascript/components/QuestionAnswerRow';

describe('<QnASummaryTable/>', () => {
  it('renders a title', () => {
    const wrapper = shallow(<QnASummaryTable title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders a list of question answers', () => {
    const questionAnswers = [
      {
        question: 'foo-question',
        answer: { answer: 'foo-answer' },
        dataTags: { 'data-foo': true },
      },
      {
        question: 'bar-question',
        answer: { answer: 'bar-answer' },
        dataTags: { 'data-bar': true, 'data-foo-bar': true },
      },
    ];
    const wrapper = mount(
      <QnASummaryTable questionsAnswers={questionAnswers} />,
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

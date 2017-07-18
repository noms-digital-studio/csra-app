import React from 'react';
import { shallow } from 'enzyme';

import QuestionAnswerRow
  from '../../../../client/javascript/components/QuestionAnswerRow';

describe('<QuestionAnswerRow/>', () => {
  const questionAnswer = {
    question: 'foo-question',
    answer: { answer: 'foo-answer' },
  };

  it('renders nothing when there is no answer prop provided', () => {
    const wrapper = shallow(<QuestionAnswerRow />);

    expect(wrapper.find('tr').length).to.equal(0);
  });

  it('renders a question and answer', () => {
    const wrapper = shallow(<QuestionAnswerRow {...questionAnswer} />);
    const wrapperText = wrapper.text();

    expect(wrapper.find('tr').length).to.equal(1);
    expect(wrapperText).to.match(new RegExp('foo-question', 'i'));
    expect(wrapperText).to.match(new RegExp('foo-answer', 'i'));
  });

  it('renders a data tag', () => {
    const questionAnswerDataTag = {
      ...questionAnswer,
      dataTags: { 'data-element-id': 'foo' },
    };
    const wrapper = shallow(<QuestionAnswerRow {...questionAnswerDataTag} />);
    const wrapperHTML = wrapper.html();

    expect(wrapperHTML).to.match(new RegExp('data-element-id', 'i'));
  });
});

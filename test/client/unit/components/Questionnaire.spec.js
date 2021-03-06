import React from 'react';
import { mount } from 'enzyme';

import Questionnaire from '../../../../client/javascript/components/Questionnaire';

const questions = [
  {
    section: 'foo-section',
    title: 'foo-title',
    description: 'foo-description',
    template: 'default_with_aside',
    aside: {
      template: 'static',
      title: 'aside-title',
      description: 'aside-description',
    },
  },
  {
    section: 'bar-section',
    title: 'bar-title',
    description: 'bar-description',
    template: 'default_with_aside',
    aside: {
      template: 'static',
      title: 'aside-title',
      description: 'aside-description',
    },
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['bar-section'],
    },
  },
];

const prisoner = {
  id: 1,
  nomisId: 'bar-id',
  surname: 'foo-surname',
  forename: 'foo-forename',
};

describe('<Questionnaire />', () => {
  it('calls actions when component mounts', () => {
    const getQuestions = sinon.spy();

    mount(<Questionnaire getQuestions={getQuestions} />);

    expect(getQuestions.calledOnce).to.equal(true);
  });

  it('renders offender name', () => {
    const wrapper = mount(<Questionnaire prisoner={prisoner} />);

    expect(wrapper.text()).to.contain('Foo-surname');
    expect(wrapper.text()).to.contain('Foo-forename');
  });

  context(
    'when there are multiple questions and you are not on the last',
    () => {
      it('calls the onSubmit action with the answer with the path to the next question', () => {
        const callback = sinon.spy();

        const match = { params: { section: 'foo-section' } };

        const wrapper = mount(<Questionnaire
          prisoner={prisoner}
          questions={questions}
          match={match}
          onSubmit={callback}
          basePath="/assessment"
        />);

        wrapper
          .find('[data-input="yes"]')
          .simulate('change', { target: { value: 'yes' } });

        wrapper.find('form').simulate('submit');

        expect(callback.calledOnce).to.equal(true, 'onSubmit called');

        expect(callback.calledWithMatch({
          prisoner,
          question: questions[0],
          section: 'foo-section',
          answer: { answer: 'yes' },
          nextPath: '/assessment/bar-section',
        })).to.equal(true, 'called with the correct props');
      });
    },
  );

  context('when on the last question', () => {
    it('calls the onSubmit action with the answer and completion path', () => {
      const callback = sinon.spy();

      const question = [
        {
          section: 'foo-section',
          title: 'foo-title',
          description: 'foo-description',
          template: 'default_with_aside',
          aside: {
            template: 'static',
            title: 'aside-title',
            description: 'aside-description',
          },
        },
      ];

      const match = { params: { section: 'foo-section' } };

      const wrapper = mount(<Questionnaire
        prisoner={prisoner}
        questions={question}
        match={match}
        onSubmit={callback}
        completionPath="/foo-complete"
      />);

      wrapper
        .find('[data-input="yes"]')
        .simulate('change', { target: { value: 'yes' } });

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(true, 'onSubmit called');

      expect(callback.calledWith({
        prisoner,
        question: questions[0],
        section: 'foo-section',
        answer: { answer: 'yes' },
        nextPath: '/foo-complete',
      })).to.equal(true, 'called with the correct props');
    });
  });
});

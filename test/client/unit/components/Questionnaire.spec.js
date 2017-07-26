import React from 'react';
import { mount } from 'enzyme';

import Questionnaire
  from '../../../../client/javascript/components/Questionnaire';

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

describe('<Questionnaire />', () => {
  it('calls actions when component mounts', () => {
    const getQuestions = sinon.spy();

    mount(<Questionnaire getQuestions={getQuestions} />);

    expect(getQuestions.calledOnce).to.equal(true);
  });

  it('renders offender name', () => {
    const prisoner = {
      'nomis-id': 'bar-id',
      surname: 'foo-surname',
      forename: 'foo-first-name',
    };
    const wrapper = mount(<Questionnaire prisoner={prisoner} />);

    expect(wrapper.text()).to.contain('foo-surname');
    expect(wrapper.text()).to.contain('foo-first-name');
  });

  context(
    'when there are multiple questions and you are not on the last',
    () => {
      it('calls the onSubmit action with the answer with the path to the next question', () => {
        const callback = sinon.spy();

        const params = { section: 'foo-section' };

        const wrapper = mount(
          <Questionnaire
            questions={questions}
            params={params}
            onSubmit={callback}
            basePath="/assessment"
          />,
        );

        wrapper
          .find('#radio-yes')
          .simulate('change', { target: { value: 'yes' } });

        wrapper.find('form').simulate('submit');

        expect(callback.calledOnce).to.equal(true, 'onSubmit called');

        expect(
          callback.calledWith({
            section: 'foo-section',
            answer: { answer: 'yes' },
            nextPath: '/assessment/bar-section',
          }),
        ).to.equal(true, 'called with the correct props');
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

      const params = { section: 'foo-section' };

      const wrapper = mount(
        <Questionnaire
          questions={question}
          params={params}
          onSubmit={callback}
          completionPath={'/foo-complete'}
        />,
      );

      wrapper
        .find('#radio-yes')
        .simulate('change', { target: { value: 'yes' } });

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(true, 'onSubmit called');

      expect(
        callback.calledWith({
          section: 'foo-section',
          answer: { answer: 'yes' },
          nextPath: '/foo-complete',
        }),
      ).to.equal(true, 'called with the correct props');
    });
  });
});

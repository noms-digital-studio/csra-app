import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import RiskAssessment from '../../../../client/javascript/pages/RiskAssessment';

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

const riskAssessment = {
  viperScore: 0.1,
  outcome: 'shared cell',
  questions: {
    'foo-section': {
      questionId: 'foo-section',
      question: 'foo-title',
      answer: 'foo-answer',
    },
    'bar-section': {
      questionId: 'bar-section',
      question: 'bar-title',
      answer: 'bar-answer',
    },
  },
};

describe('<RiskAssessment />', () => {
  let store;

  beforeEach(() => {
    store = fakeStore({
      questions: {
        riskAssessment: questions,
      },
      offender: {
        selected: {
          id: 1,
          forename: 'foo-forename',
          surname: 'foo-surname',
          dateOfBirth: '17-Nov-1999',
          nomisId: 'AA54321XX',
        },
      },
      assessments: {
        risk: riskAssessment,
      },
    });
  });

  it('calls actions when component mounts', () => {
    mount(
      <Provider store={store}>
        <RiskAssessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    expect(store.dispatch.calledWithMatch({ type: 'GET_RISK_ASSESSMENT_QUESTIONS' })).to.equal(
      true,
      'dispatch GET_RISK_ASSESSMENT_QUESTIONS',
    );
  });

  it('renders offender details', () => {
    const wrapper = mount(
      <Provider store={store}>
        <RiskAssessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('foo-surname');
    expect(wrapper.text()).to.contain('foo-forename');
  });

  it('calls the onSubmit action with the answer and section', () => {
    const wrapper = mount(
      <Provider store={store}>
        <RiskAssessment params={{ section: 'foo-section' }} />
      </Provider>,
    );

    wrapper.find('#radio-yes').simulate('change', { target: { value: 'yes' } });
    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: 'STORE_ASSESSMENT_ANSWER',
        payload: {
          id: 1,
          questionAnswer: {
            'foo-section': {
              questionId: 'foo-section',
              question: 'foo-title',
              answer: 'yes',
            },
          },
          assessmentType: 'risk',
        },
      }),
    ).to.equal(true, 'Did not dispatched STORE_ASSESSMENT_ANSWER');

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'push', args: ['/risk-assessment/bar-section'] },
      }),
    ).to.equal(true, 'Did not changed path to /risk-assessment/bar-section');
  });
});

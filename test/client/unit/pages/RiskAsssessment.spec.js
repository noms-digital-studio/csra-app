import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
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

const storeData = {
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
  assessmentStatus: {
    awaitingSubmission: {
      risk: [],
    },
  },
};

const mountApp = store => mount(<Provider store={store}>
  <Router>
    <RiskAssessment params={{ section: 'foo-section' }} />
  </Router>
</Provider>); // eslint-disable-line react/jsx-closing-tag-location

describe('<RiskAssessment />', () => {
  let store;

  beforeEach(() => {
    store = fakeStore(storeData);
  });

  it('calls actions when component mounts', () => {
    mountApp(store);

    expect(store.dispatch.calledWithMatch({ type: 'GET_RISK_ASSESSMENT_QUESTIONS' })).to.equal(
      true,
      'dispatch GET_RISK_ASSESSMENT_QUESTIONS',
    );
  });

  it('renders offender details', () => {
    const wrapper = mountApp(store);

    expect(wrapper.text()).to.contain('Foo-surname');
    expect(wrapper.text()).to.contain('Foo-forename');
  });

  it('calls the onSubmit action with the answer and section', () => {
    const wrapper = mount(<Provider store={store}>
      <RiskAssessment params={{ section: 'foo-section' }} />
    </Provider>); // eslint-disable-line react/jsx-closing-tag-location

    wrapper.find('[data-input="yes"]').simulate('change', { target: { value: 'yes' } });
    wrapper.find('form').simulate('submit');

    expect(store.dispatch.calledWithMatch({
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
    })).to.equal(true, 'Did not dispatched STORE_ASSESSMENT_ANSWER');

    expect(store.dispatch.calledWithMatch({
      type: '@@router/CALL_HISTORY_METHOD',
      payload: { method: 'push', args: ['/risk-assessment/bar-section'] },
    })).to.equal(true, 'Did not changed path to /risk-assessment/bar-section');
  });
});

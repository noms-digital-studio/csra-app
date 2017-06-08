import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import riskAssessmentQuestions from '../fixtures/riskAssessmentQuestions.json';

import FullAssessmentOutcome
  from '../../../../client/javascript/pages/FullAssessmentOutcome';

const prisonerDetails = {
  firstName: 'foo-name',
  surname: 'foo-surname',
  dob: 'foo-date',
  nomisId: 'foo-nomis-id',
};

const riskAssessmentAnswers = {
  'how-do-you-feel': {
    comments: 'foo-comment',
  },
  'prison-self-assessment': {
    answer: 'no',
  },
  vulnerability: {
    answer: 'no',
  },
  'gang-affiliation': {
    answer: 'no',
    comments: 'foo-comment',
  },
  'drug-misuse': {
    answer: 'no',
  },
  prejudice: {
    answer: 'no',
  },
  'officers-assessment': {
    answer: 'no',
  },
};

const healthcareAnswers = {
  outcome: {
    answer: 'no',
  },
  comments: {
    comments: 'foo-comment',
  },
  consent: {
    answer: 'no',
  },
  assessor: {
    role: 'foo role',
    'full-name': 'Foo fullname',
    day: '20',
    month: '12',
    year: '1984',
  },
};

const state = {
  answers: {
    selectedPrisonerId: 'foo-nomis-id',
    riskAssessment: {
      'foo-nomis-id': riskAssessmentAnswers,
    },
    healthcare: {
      'foo-nomis-id': healthcareAnswers,
    },
  },
  questions: {
    riskAssessment: riskAssessmentQuestions,
  },
  riskAssessmentStatus: {
    exitPoint: '',
    completed: [{ recommendation: 'shared cell', nomisId: 'foo-nomis-id' }],
  },
  healthcareStatus: {
    completed: [{ recommendation: 'shared cell', nomisId: 'foo-nomis-id' }],
  },
  offender: {
    selected: prisonerDetails,
  },
};

describe('<FullAssessmentOutcome', () => {
  it('render the page without errors', () => {
    const store = fakeStore(state);
    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );
  });

  it('includes the prisoner profile', () => {
    const store = fakeStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const profile = wrapper.find('[data-profile]');

    Object.keys(prisonerDetails).forEach((key) => {
      expect(profile.text()).to.contain(prisonerDetails[key]);
    });
  });

  it('renders the outcome of the assessment', () => {
    const store = fakeStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );
    const outcome = wrapper.find('[data-recommended-outcome]').text();

    expect(outcome).to.include('Shared cell');
  });

  it('includes the risk assessment answers', () => {
    const store = fakeStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const riskAssessmentSummaryText = wrapper
      .find('[data-risk-summary]')
      .text();

    expect(riskAssessmentSummaryText).to.contain('Shared cell');

    Object.keys(riskAssessmentAnswers).forEach((key) => {
      Object.keys(riskAssessmentAnswers[key]).forEach((innerKey) => {
        const regex = new RegExp(riskAssessmentAnswers[key][innerKey], 'i');
        expect(riskAssessmentSummaryText).to.match(regex);
      });
    });
  });

  it('includes the healthcare assessment answers', () => {
    const store = fakeStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const healthcareSummaryText = wrapper.find('[data-health-summary]').text();

    Object.keys(healthcareAnswers).forEach((key) => {
      Object.keys(healthcareAnswers[key]).forEach((innerKey) => {
        const regex = new RegExp(healthcareAnswers[key][innerKey], 'i');

        if (innerKey === 'outcome') {
          expect(healthcareSummaryText).to.match(/shared cell/i);
        } else {
          expect(healthcareSummaryText).to.match(regex);
        }
      });
    });
  });

  it('form submission it navigates to the full assessment page', () => {
    const store = fakeStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'replace', args: ['/full-assessment-complete'] },
      }),
    ).to.equal(true, 'Changed path to /full-assessment-complete');
  });
});

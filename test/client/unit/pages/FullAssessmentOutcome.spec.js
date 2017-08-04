import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import riskAssessmentQuestions from '../fixtures/riskAssessmentQuestions.json';

import FullAssessmentOutcome
  from '../../../../client/javascript/pages/FullAssessmentOutcome';

const prisonerDetails = {
  id: 1,
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '2010-01-01T00:00:00.000Z',
  nomisId: 'foo-nomisId',
  outcome: null,
};

const riskAssessmentAnswers = {
  'how-do-you-feel': {
    comments: 'foo-comment',
  },
  'harm-cell-mate': {
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
    selectedAssessmentId: 'foo-nomis-id',
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
    completed: [{ recommendation: 'shared cell', assessmentId: 1, rating: 'standard', reasons: [] }],
  },
  healthcareStatus: {
    completed: [{ recommendation: 'shared cell', assessmentId: 1 }],
  },
  offender: {
    selected: prisonerDetails,
  },
};

describe('<FullAssessmentOutcome', () => {
  it('renders the page without errors', () => {
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

    const prisonerProfile = wrapper.find('[data-element-id="prisoner-profile"]').text();

    expect(prisonerProfile).to.contain('Foo-name');
    expect(prisonerProfile).to.contain('foo-surname');
    expect(prisonerProfile).to.contain('01 January 2010');
    expect(prisonerProfile).to.contain('foo-nomisId');
  });

  it('displays the reasons if outcome is shared with conditions', () => {
    const stateWithReasons = {
      ...state,
      riskAssessmentStatus: {
        completed: [
          {
            recommendation: 'shared cell with conditions',
            assessmentId: 1,
            reasons: ['foo-reason', 'bar-reason'],
          },
        ],
      },
    };
    const store = fakeStore(stateWithReasons);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const reasons = wrapper.find('[data-element-id="reasons"]').text();
    const outcome = wrapper.find('[data-element-id="recommended-outcome"]').text();

    expect(outcome).to.include('Shared cell with conditions');
    expect(reasons).to.include('foo-reason');
    expect(reasons).to.include('bar-reason');
  });

  it('renders the outcome of the assessment', () => {
    const store = fakeStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );
    const outcome = wrapper.find('[data-element-id="recommended-outcome"]').text();

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

    const healthcareSummaryText = wrapper.find('[data-element-id="health-summary"]').text();

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

  it('navigates to the full assessment complete page on form submission', () => {
    const store = fakeStore(state);
    const putStub = sinon.stub(xhr, 'put');
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    putStub.yields(null, { statusCode: 200 });

    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'replace', args: ['/full-assessment-complete'] },
      }),
    ).to.equal(true, 'Changed path to /full-assessment-complete');

    putStub.restore();
  });

  it('navigates to the error page on form submission when there is an error', () => {
    const store = fakeStore(state);
    const putStub = sinon.stub(xhr, 'put');
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    putStub.yields(null, { statusCode: 500 });

    wrapper.find('form').simulate('submit');

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'replace', args: ['/error'] },
      }),
    ).to.equal(true, 'Changed path to /error');

    putStub.restore();
  });

  context('when the assessment has already been completed', () => {
    const stateWithOutcomes = {
      ...state,
      offender: {
        selected: { ...prisonerDetails, outcome: 'Foo outcome' },
      },
    };

    it('does not allow users to complete the assessment again', () => {
      const store = fakeStore(stateWithOutcomes);

      const wrapper = mount(
        <Provider store={store}>
          <FullAssessmentOutcome />
        </Provider>,
      );

      expect(wrapper.find('form').length).to.equal(0);
    });

    it('allow the user to return to the dashboard', () => {
      const store = fakeStore(stateWithOutcomes);

      const wrapper = mount(
        <Provider store={store}>
          <FullAssessmentOutcome />
        </Provider>,
      );

      expect(wrapper.find('[data-element-id="continue-button"]').length).to.eql(1);

      wrapper.find('[data-element-id="continue-button"]').simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'replace', args: ['/dashboard'] },
        }),
      ).to.equal(true, 'Did not change path to /dashboard');
    });
  });
});

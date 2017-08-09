import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import FullAssessmentOutcome from '../../../../client/javascript/pages/FullAssessmentOutcome';

const prisoner = {
  id: 1,
  nomisId: 'foo-nomis-id',
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '1990-12-11T00:00:00.000Z',
  outcome: null,
  riskAssessmentCompleted: true,
  healthAssessmentCompleted: true,
};

const riskAssessment = {
  viperScore: null,
  questions: {
    introduction: {
      questionId: 'introduction',
      question: 'Making this process fair and open',
      answer: 'accepted',
    },
    'risk-of-violence': {
      questionId: 'risk-of-violence',
      question: 'Viper result',
      answer: '',
    },
    'how-do-you-feel': {
      questionId: 'how-do-you-feel',
      question: 'How do you think they feel about sharing a cell at this moment?',
      answer: 'foo comment',
    },
    'harm-cell-mate': {
      questionId: 'harm-cell-mate',
      question: 'Is there any genuine indication they might seriously hurt a cellmate?',
      answer: 'no',
    },
    vulnerability: {
      questionId: 'vulnerability',
      question:
        "Do you think they're likely to lash out because they're scared or feeling vulnerable?",
      answer: 'no',
    },
    'gang-affiliation': {
      questionId: 'gang-affiliation',
      question: 'Are they in a gang?',
      answer: 'no',
    },
    'drug-misuse': {
      questionId: 'drug-misuse',
      question: 'Have they taken illicit drugs in the last month?',
      answer: 'no',
    },
    prejudice: {
      questionId: 'prejudice',
      question: 'Do they have any hostile views or prejudices?',
      answer: 'yes',
    },
    'officers-assessment': {
      questionId: 'officers-assessment',
      question: 'Are there any other reasons why you would recommend they have a single cell?',
      answer: 'no',
    },
  },
  outcome: 'shared cell with conditions',
  reasons: [
    {
      questionId: 'foo-id',
      reason: 'foo-reason',
    },
    {
      questionId: 'bar-id',
      reason: 'bar-reason',
    },
  ],
};

const healthcareAssessment = {
  viperScore: null,
  questions: {
    outcome: {
      questionId: 'outcome',
      question: 'Does healthcare recommend a single cell?',
      answer: 'no',
    },
    comments: {
      questionId: 'comments',
      question: 'Enter all the comments on the healthcare form',
      answer: '',
    },
    consent: {
      questionId: 'consent',
      question: 'Have they given consent to share their medical information?',
      answer: 'no',
    },
    assessor: {
      questionId: 'assessor',
      question: 'Who completed the healthcare assessment?',
      answer: ' Nurse, Foo Bar, 4-8-2017',
    },
  },
  outcome: 'shared cell',
};

const state = {
  offender: {
    selected: prisoner,
  },
  assessments: {
    risk: {
      1: riskAssessment,
    },
    healthcare: {
      1: healthcareAssessment,
    },
  },
};

describe('<FullAssessmentOutcome', () => {
  let getStub;

  beforeEach(() => {
    getStub = sinon.stub(xhr, 'get');
    getStub.yields(
      null,
      { statusCode: 200 },
      {
        outcome: null,
        riskAssessment: JSON.stringify(riskAssessment),
        healthAssessment: JSON.stringify(healthcareAssessment),
      },
    );
  });

  afterEach(() => {
    getStub.restore();
  });

  it('renders the page without errors', () => {
    const store = fakeStore(state);
    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );
  });

  it('stores the assessment outcome on mount', () => {
    const store = fakeStore(state);

    const putStub = sinon.stub(xhr, 'put');

    putStub.onFirstCall().yields(null, { statusCode: 200 });

    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    expect(putStub.lastCall.args[0]).to.equal('/api/assessments/1/outcome');
    expect(putStub.lastCall.args[1]).to.eql({
      json: {
        outcome: 'shared cell with conditions',
      },
      timeout: 3500,
    });

    putStub.restore();
  });

  it('stores the risk assessment on mount', () => {
    const store = fakeStore(state);

    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    expect(store.dispatch.calledWithMatch({
      type: 'STORE_ASSESSMENT',
      payload: {
        assessmentType: 'risk',
        id: 1,
        assessment: riskAssessment,
      },
    }));
  });

  it('stores the health assessment on mount', () => {
    const store = fakeStore(state);

    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    expect(store.dispatch.calledWithMatch({
      type: 'STORE_ASSESSMENT',
      payload: {
        assessmentType: 'healthcare',
        id: 1,
        assessment: healthcareAssessment,
      },
    }));
  });

  it('navigates to an error page if it fails to retrieve data', () => {
    const store = fakeStore(state);

    getStub.yields(null, { statusCode: 500 });

    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'replace', args: ['/error'] },
      }),
    ).to.equal(true, 'Did not change path to /error');
  });

  it('navigates to an error page if it fails to store the assessment outcome', () => {
    const store = fakeStore(state);
    const putStub = sinon.stub(xhr, 'put');

    putStub.onFirstCall().yields(null, { statusCode: 500 });

    mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    expect(
      store.dispatch.calledWithMatch({
        type: '@@router/CALL_HISTORY_METHOD',
        payload: { method: 'replace', args: ['/error'] },
      }),
    ).to.equal(true, 'Did not change path to /error');

    putStub.restore();
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
    expect(prisonerProfile).to.contain('11 December 1990');
    expect(prisonerProfile).to.contain('foo-nomis-id');
  });

  it('displays the reasons if outcome is shared with conditions', () => {
    const store = fakeStore(state);

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
    const questions = riskAssessment.questions;
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const riskAssessmentSummaryText = wrapper
      .find('[data-element-id="risk-assessment-summary"]')
      .text();

    Object.keys(questions).forEach((key) => {
      if (key === 'introduction') return;

      const answer = questions[key].answer;
      const regex = new RegExp(answer, 'i');

      expect(riskAssessmentSummaryText).to.match(regex);
    });
  });

  it('includes the healthcare assessment answers', () => {
    const store = fakeStore(state);
    const questions = healthcareAssessment.questions;
    const wrapper = mount(
      <Provider store={store}>
        <FullAssessmentOutcome />
      </Provider>,
    );

    const healthcareSummaryText = wrapper.find('[data-element-id="health-summary"]').text();

    Object.keys(questions).forEach((key) => {
      const answer = questions[key].answer;
      const regex = new RegExp(answer, 'i');

      if (key === 'assessor') {
        expect(healthcareSummaryText).to.include('Nurse');
        expect(healthcareSummaryText).to.include('Foo Bar');
        expect(healthcareSummaryText).to.include('4 August 2017');
        return;
      }

      expect(healthcareSummaryText).to.match(regex);
    });
  });

  it('navigates to the full assessment complete page on form submission', () => {
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

  context('when the assessment has already been completed', () => {
    const stateWithOutcomes = {
      ...state,
      offender: {
        selected: { ...prisoner, outcome: 'Foo outcome' },
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

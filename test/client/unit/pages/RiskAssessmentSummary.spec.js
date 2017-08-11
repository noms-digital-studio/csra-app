import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import RiskAssessmentSummary from '../../../../client/javascript/pages/RiskAssessmentSummary';

import riskAssessmentQuestions from '../fixtures/riskAssessmentQuestions.json';

const prisoner = {
  id: 1,
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '2010-01-01T00:00:00.000Z',
  nomisId: 'foo-nomis-id',
  healthAssessmentCompleted: false,
};

const riskAssessment = {
  viperScore: 0.1,
  outcome: 'shared cell',
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
      answer: 'no',
    },
    'officers-assessment': {
      questionId: 'officers-assessment',
      question: 'Are there any other reasons why you would recommend they have a single cell?',
      answer: 'no',
    },
  },
};

const state = {
  questions: {
    riskAssessment: riskAssessmentQuestions,
  },
  offender: {
    selected: prisoner,
  },
  assessments: {
    risk: {
      1: riskAssessment,
    },
  },
};

describe('<RiskAssessmentSummary />', () => {
  context('Connected RiskAssessmentSummary', () => {
    context('when the assessment outcome is low', () => {
      it('renders the prisoners profile details', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        const prisonerProfile = wrapper.find('[data-element-id="prisoner-profile"]').text();

        expect(prisonerProfile).to.contain('Foo-name');
        expect(prisonerProfile).to.contain('foo-surname');
        expect(prisonerProfile).to.contain('01 January 2010');
        expect(prisonerProfile).to.contain('foo-nomis-id');
      });

      it('renders a "shared cell" outcome', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );
        const outcomeText = wrapper.find('[data-element-id="risk-assessment-outcome"]').text();
        const riskText = wrapper.find('[data-element-id="risk-assessment-risk"]').text();
        const reasonsText = wrapper.find('[data-element-id="risk-assessment-reasons"]');

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'risk', id: 1, outcome: 'shared cell' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(outcomeText).to.contain('Shared cell');
        expect(riskText).to.contain('Standard');
        expect(reasonsText.text).to.throw();
      });

      it('renders a "shared cell with conditions" outcome', () => {
        const sharedCellOutcomeState = {
          ...state,
          assessments: {
            risk: {
              1: {
                ...riskAssessment,
                questions: {
                  ...riskAssessment.questions,
                  'gang-affiliation': {
                    questionId: 'gang-affiliation',
                    question: 'Are they in a gang?',
                    answer: 'yes',
                  },
                  'drug-misuse': {
                    questionId: 'drug-misuse',
                    question: 'Have they taken illicit drugs in the last month?',
                    answer: 'yes',
                  },
                },
                outcome: 'shared cell with conditions',
                reasons: [
                  {
                    questionId: 'drug-misuse',
                    reason: 'Has indicated drug use',
                  },
                  {
                    questionId: 'gang-affiliation',
                    reason: 'Has indicated gang affiliation',
                  },
                ],
              },
            },
          },
        };
        const store = fakeStore(sharedCellOutcomeState);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        const outcomeText = wrapper.find('[data-element-id="risk-assessment-outcome"]').text();
        const riskText = wrapper.find('[data-element-id="risk-assessment-risk"]').text();
        const reasonsText = wrapper.find('[data-element-id="risk-assessment-reasons"]').text();

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'risk', id: 1, outcome: 'shared cell with conditions' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_REASONS',
            payload: {
              assessmentType: 'risk',
              id: 1,
              reasons: [
                {
                  questionId: 'gang-affiliation',
                  reason: 'Has indicated gang affiliation',
                },
                {
                  questionId: 'drug-misuse',
                  reason: 'Has indicated drug use',
                },
              ],
            },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_REASONS');

        expect(outcomeText).to.contain('Shared cell with conditions');
        expect(riskText).to.contain('Standard');
        expect(reasonsText).to.contain('Has indicated gang affiliation');
        expect(reasonsText).to.contain('Has indicated drug use');
      });

      it('renders a "single cell" outcome', () => {
        const singleCellOutcomeState = {
          ...state,
          assessments: {
            risk: {
              1: {
                ...riskAssessment,
                questions: {
                  ...riskAssessment.questions,
                  'harm-cell-mate': {
                    questionId: 'harm-cell-mate',
                    question:
                      'Is there any genuine indication they might seriously hurt a cellmate?',
                    answer: 'yes',
                    'reasons-yes': 'foo-reason-yes answer',
                  },
                },
                outcome: 'single cell',
                reasons: [
                  {
                    questionId: 'harm-cell-mate',
                    reason: 'Officer thinks they might seriously hurt cellmate',
                  },
                ],
              },
            },
          },
        };

        const store = fakeStore(singleCellOutcomeState);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );
        const outcomeText = wrapper.find('[data-element-id="risk-assessment-outcome"]').text();
        const riskText = wrapper.find('[data-element-id="risk-assessment-risk"]').text();
        const reasonsText = wrapper.find('[data-element-id="risk-assessment-reasons"]').text();

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_REASONS',
            payload: {
              assessmentType: 'risk',
              id: 1,
              reasons: [
                {
                  questionId: 'harm-cell-mate',
                  reason: 'Officer thinks they might seriously hurt cellmate',
                },
              ],
            },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_REASONS');

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'risk', id: 1, outcome: 'single cell' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(outcomeText).to.contain('Single cell');
        expect(riskText).to.contain('High');
        expect(reasonsText).to.include('Officer thinks they might seriously hurt cellmate');
        expect(reasonsText).to.include('foo-reason-yes answer');
      });
    });

    context('when the assessment outcome is high due to the viper score', () => {
      it('renders the outcome of a high risk assessment', () => {
        const store = fakeStore({
          ...state,
          assessments: {
            risk: {
              1: {
                ...riskAssessment,
                viperScore: 0.75,
                outcome: 'single cell',
                reasons: [{ questionId: 'risk-of-violence', reason: 'has a high viper score' }],
              },
            },
          },
        });
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );
        const outcomeText = wrapper.find('[data-element-id="risk-assessment-outcome"]').text();
        const riskText = wrapper.find('[data-element-id="risk-assessment-risk"]').text();
        const reasonsText = wrapper.find('[data-element-id="risk-assessment-reasons"]').text();

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_REASONS',
            payload: {
              assessmentType: 'risk',
              id: 1,
              reasons: [{ questionId: 'risk-of-violence', reason: 'has a high viper score' }],
            },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_REASONS');

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'risk', id: 1, outcome: 'single cell' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(outcomeText).to.contain('Single cell');
        expect(riskText).to.contain('High');
        expect(reasonsText).to.equal('has a high viper score');
      });
    });

    context('when the healthcare assessment is incomplete', () => {
      let store;
      let putStub;
      let getStub;

      beforeEach(() => {
        store = fakeStore(state);
        putStub = sinon.stub(xhr, 'put');
        getStub = sinon.stub(xhr, 'get');
      });

      afterEach(() => {
        getStub.restore();
        putStub.restore();
      });

      it('displays a message informing the user that they need to complete the healthcare assessment', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        expect(wrapper.find('[data-element-id="assessment-results"]').text()).to.contain(
          'Both the risk and allocation recommendation',
        );

        expect(wrapper.find('[data-summary-next-steps]').text()).to.contain(
          'You must print a copy of this summary for healthcare.',
        );

        expect(wrapper.find('[data-element-id="continue-button"]').text()).to.equal(
          'Finish assessment',
        );
      });

      it('on submission it navigates to the prisoner list', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        getStub.yields(null, { statusCode: 200 }, { healthAssessment: null });
        putStub.yields(null, { statusCode: 200 }, { foo: 'bar' });

        expect(wrapper.find('button[type="submit"]').getNode().hasAttribute('disabled')).to.equal(
          false,
        );

        wrapper.find('form').simulate('submit');

        expect(wrapper.find('button[type="submit"]').getNode().hasAttribute('disabled')).to.equal(
          true,
        );

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/dashboard'] },
          }),
        ).to.equal(true, 'Changed path to /dashboard');
      });

      it('navigates to the error page on form submission when it fails to PUT the assessment', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        getStub.yields(null, { statusCode: 200 }, { healthAssessment: null });
        putStub.yields(null, { statusCode: 500 });

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/error'] },
          }),
        ).to.equal(true, 'Changed path to /error');
      });

      it('navigates to the error page on form submission when it fails to GET the latests assessment', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        getStub.yields(null, { statusCode: 500 });

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/error'] },
          }),
        ).to.equal(true, 'Changed path to /error');
      });
    });

    context('when the healthcare assessment is complete', () => {
      let store;
      let putStub;
      let getStub;
      const stateWithCompletedHealthcare = {
        ...state,
        offender: {
          selected: { ...prisoner, healthAssessmentCompleted: true },
        },
      };

      beforeEach(() => {
        store = fakeStore(stateWithCompletedHealthcare);
        putStub = sinon.stub(xhr, 'put');
        getStub = sinon.stub(xhr, 'get');
      });

      afterEach(() => {
        getStub.restore();
        putStub.restore();
      });

      it('displays a message informing the user that they can see their assessment outcome', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        expect(wrapper.find('[data-element-id="assessment-results"]').text()).to.not.contain(
          'Both the risk and allocation recommendation',
        );

        expect(wrapper.find('[data-element-id="continue-button"]').text()).to.equal(
          'Finish assessment',
        );
      });

      it('on submission it navigates to the full assessment page', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        getStub.yields(null, { statusCode: 200 }, { healthAssessment: { foo: 'bar' } });
        putStub.yields(null, { statusCode: 200 });

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/full-assessment-outcome'] },
          }),
        ).to.equal(true, 'Changed path to /full-assessment-outcome');

        putStub.restore();
      });
    });
  });
});

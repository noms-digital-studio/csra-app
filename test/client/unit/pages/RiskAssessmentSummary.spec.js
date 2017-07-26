import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import RiskAssessmentSummary
  from '../../../../client/javascript/pages/RiskAssessmentSummary';

import riskAssessmentQuestions from '../fixtures/riskAssessmentQuestions.json';

const prisonerDetails = {
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '1-1-2010',
  nomisId: 'foo-nomis-id',
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

const state = {
  answers: {
    selectedPrisonerId: 'foo-nomis-id',
    riskAssessment: {
      'foo-nomis-id': riskAssessmentAnswers,
    },
  },
  questions: {
    riskAssessment: riskAssessmentQuestions,
  },
  riskAssessmentStatus: {
    completed: [],
  },
  healthcareStatus: {
    completed: [],
  },
  offender: {
    selected: prisonerDetails,
    viperScores: [
      {
        nomisId: 'foo-nomis-id',
        viperScore: 0.10,
      },
    ],
  },
};


describe('<RiskAssessmentSummary />', () => {
  let postStub;
  before(() => {
    postStub = sinon.stub(xhr, 'post');
    postStub.yields(null, { status: 200 }, { data: { id: 123 } });
  });
  after(() => {
    postStub.restore();
  });

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
        expect(prisonerProfile).to.contain('1 January 2010');
        expect(prisonerProfile).to.contain('foo-nomis-id');
      });

      it('renders a "shared cell" outcome', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );
        const outcomeText = wrapper
          .find('[data-element-id="risk-assessment-outcome"]')
          .text();

        const riskText =
          wrapper
            .find('[data-element-id="risk-assessment-risk"]')
            .text();

        const reasonsText =
          wrapper
            .find('[data-element-id="risk-assessment-reasons"]');

        expect(outcomeText).to.contain('Shared cell');
        expect(riskText).to.contain('Standard');
        expect(reasonsText.text).to.throw();
      });

      it('renders a "shared cell with conditions" outcome', () => {
        const answers = {
          ...riskAssessmentAnswers,
          'gang-affiliation': {
            answer: 'yes',
          },
          'drug-misuse': {
            answer: 'yes',
          },
        };
        const unknownRiskStore = fakeStore({
          ...state,
          answers: {
            selectedPrisonerId: 'foo-nomis-id',
            riskAssessment: {
              'foo-nomis-id': answers,
            },
          },
          riskAssessmentStatus: {
            completed: [],
          },
          offender: {
            selected: prisonerDetails,
            viperScores: [],
          },
        });
        const wrapper = mount(
          <Provider store={unknownRiskStore}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        const outcomeText =
          wrapper
            .find('[data-element-id="risk-assessment-outcome"]')
            .text();

        const riskText =
          wrapper
            .find('[data-element-id="risk-assessment-risk"]')
            .text();

        const reasonsText =
          wrapper
            .find('[data-element-id="risk-assessment-reasons"]')
            .text();

        expect(outcomeText).to.contain('Shared cell with conditions');
        expect(riskText).to.contain('Standard');
        expect(reasonsText).to.contain('Has indicated gang affiliation');
        expect(reasonsText).to.contain('Has indicated drug use');
      });

      it('renders a "single cell" outcome', () => {
        const answers = {
          ...riskAssessmentAnswers,
          'harm-cell-mate': {
            answer: 'yes',
          },
        };
        const unknownRiskStore = fakeStore({
          ...state,
          answers: {
            selectedPrisonerId: 'foo-nomis-id',
            riskAssessment: {
              'foo-nomis-id': answers,
            },
          },
          riskAssessmentStatus: {
            completed: [],
          },
          offender: {
            selected: prisonerDetails,
            viperScores: [],
          },
        });
        const wrapper = mount(
          <Provider store={unknownRiskStore}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        const outcomeText =
          wrapper
            .find('[data-element-id="risk-assessment-outcome"]')
            .text();

        const riskText =
          wrapper
            .find('[data-element-id="risk-assessment-risk"]')
            .text();

        const reasonsText =
          wrapper
            .find('[data-element-id="risk-assessment-reasons"]')
            .text();

        expect(outcomeText).to.contain('Single cell');
        expect(riskText).to.contain('High');
        expect(reasonsText).to.equal('Officer thinks they might seriously hurt cellmate');
      });
    });

    context('when the assessment outcome is high due to the viper score', () => {
      const highRiskStore = fakeStore({
        ...state,
        riskAssessmentStatus: {
          completed: [],
        },
        offender: {
          selected: prisonerDetails,
          viperScores: [
            {
              nomisId: 'foo-nomis-id',
              viperScore: 0.79,
            },
          ],
        },
      });

      it('renders the outcome of a high risk assessment', () => {
        const wrapper = mount(
          <Provider store={highRiskStore}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        const outcomeText =
          wrapper
            .find('[data-element-id="risk-assessment-outcome"]')
            .text();

        const riskText =
          wrapper
            .find('[data-element-id="risk-assessment-risk"]')
            .text();

        const reasonsText =
          wrapper
            .find('[data-element-id="risk-assessment-reasons"]')
            .text();

        expect(outcomeText).to.contain('Single cell');
        expect(riskText).to.contain('High');
        expect(reasonsText).to.equal('has a high viper score');
      });
    });

    context('when the assessment is complete', () => {
      xit('allows the user to change answers', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        wrapper.find('[data-change-answers]').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {
              method: 'replace',
              args: ['/risk-assessment/introduction'],
            },
          }),
        ).to.equal(true, 'Changed path to /risk-assessment/introduction');
      });

      it('marks the assessment as complete on submission', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: 'COMPLETE_RISK_ASSESSMENT',
            payload: {
              recommendation: 'shared cell',
              nomisId: 'foo-nomis-id',
              assessmentId: 123,
            },
          }),
        ).to.equal(true, 'triggered complete assessment');
      });

      it('marks the assessment complete with reasons upon submission', () => {
        const stateWithReason = {
          ...state,
          answers: {
            selectedPrisonerId: 'foo-nomis-id',
            riskAssessment: {
              'foo-nomis-id': {
                ...riskAssessmentAnswers,
                'gang-affiliation': {
                  answer: 'yes',
                },
              },
            },
          },
        };

        const store = fakeStore(stateWithReason);
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );
        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: 'COMPLETE_RISK_ASSESSMENT',
            payload: {
              rating: 'standard',
              recommendation: 'shared cell with conditions',
              reasons: ['Has indicated gang affiliation'],
              nomisId: 'foo-nomis-id',
              assessmentId: 123,
            },
          }),
        ).to.equal(true, 'triggered complete assessment');
      });
    });


    context('when the health care assessment is incomplete', () => {
      const store = fakeStore(state);

      it('displays a message informing the user that they need to complete the healthcare assessment', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        expect(wrapper.find('[data-summary-next-steps]').text()).to.contain(
          'You must print a copy of this summary for healthcare.',
        );

        expect(
          wrapper.find('[data-element-id="continue-button"]').text(),
        ).to.equal('Submit and return to prisoner list');
      });

      it('on submission it navigates to the prisoner list', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/dashboard'] },
          }),
        ).to.equal(true, 'Changed path to /dashboard');
      });
    });

    context('when the healthcare assessment is complete', () => {
      const storeDataCompleted = {
        ...state,
        healthcareStatus: {
          completed: [{ nomisId: 'foo-nomis-id' }],
        },
      };
      const store = fakeStore(storeDataCompleted);

      it('displays a message informing the user that they can see their assessment outcome', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        expect(
          wrapper.find('[data-element-id="continue-button"]').text(),
        ).to.equal('Submit and complete assessment');
      });

      it('on submission it navigates to the full assessment page', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>,
        );

        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/full-assessment-outcome'] },
          }),
        ).to.equal(true, 'Changed path to /full-assessment-outcome');
      });
    });
  });
});

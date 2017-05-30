/* eslint-disable comma-dangle */

import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import RiskAssessmentSummary
  from '../../../../client/javascript/pages/RiskAssessmentSummary';

const prisonerDetails = {
  firstName: 'foo-name',
  surname: 'foo-surname',
  dob: 'foo-date',
  nomisId: 'foo-nomis-id'
};

const riskAssessmentQuestions = [
  {
    section: 'foo-section',
    title: 'foo-title',
    description: 'foo-description',
    template: 'default_with_aside',
    aside: {
      template: 'static',
      title: 'aside-title',
      description: 'aside-description'
    },
    sharedCellPredicate: {
      type: 'QUESTION',
      value: 'no',
      dependents: ['foo-section'],
      reasons: ['foo-reason']
    }
  }
];

const riskAssessmentAnswers = {
  'bar-section': {
    comments: 'bar-reason'
  },
  'foo-section': {
    answer: 'no',
    'reasons-no': 'foo-reason'
  }
};

describe('<RiskAssessmentSummary />', () => {
  context('Connected RiskAssessmentSummary', () => {
    const state = {
      answers: {
        selectedPrisonerId: 'foo-nomis-id',
        riskAssessment: {
          'foo-nomis-id': riskAssessmentAnswers
        }
      },
      questions: {
        riskAssessment: riskAssessmentQuestions
      },
      riskAssessmentStatus: {
        exitPoint: ''
      },
      healthcareStatus: {
        completed: []
      },
      offender: {
        selected: prisonerDetails,
        viperScores: [
          {
            nomisId: 'foo-nomis-id',
            viperScore: 0.10
          }
        ]
      }
    };

    it('renders the prisoners profile details', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <RiskAssessmentSummary />
        </Provider>
      );
      const profileText = wrapper.find('[data-profile]').text();
      expect(profileText).to.contain('foo-name');
      expect(profileText).to.contain('foo-surname');
      expect(profileText).to.contain('foo-date');
      expect(profileText).to.contain('foo-nomis-id');
    });

    it('renders the outcome of a low risk the assessment', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <RiskAssessmentSummary />
        </Provider>
      );
      const outcomeText = wrapper.find('[data-risk-assessment-outcome]').text();

      expect(outcomeText).to.contain('Shared cell');
    });

    it('renders the outcome of a high risk assessment', () => {
      const highRiskStore = fakeStore({
        ...state,
        riskAssessmentStatus: {
          exitPoint: 'foo-section'
        },
        offender: {
          selected: prisonerDetails,
          viperScores: [
            {
              nomisId: 'foo-nomis-id',
              viperScore: 0.79
            }
          ]
        }
      });
      const wrapper = mount(
        <Provider store={highRiskStore}>
          <RiskAssessmentSummary />
        </Provider>
      );

      const outcomeText = wrapper.find('[data-risk-assessment-outcome]').text();

      expect(outcomeText).to.contain('Single cell');
    });

    it('hides the change button if the viperscore is high', () => {
      const highRiskStore = fakeStore({
        ...state,
        riskAssessmentStatus: {
          exitPoint: 'foo-section'
        },
        offender: {
          selected: prisonerDetails,
          viperScores: [
            {
              nomisId: 'foo-nomis-id',
              viperScore: 0.79
            }
          ]
        }
      });
      const wrapper = mount(
        <Provider store={highRiskStore}>
          <RiskAssessmentSummary />
        </Provider>
      );

      expect(wrapper.find('data-change-answers').length).to.equal(0);
    });

    it('renders the outcome of a unknown risk assessment', () => {
      const unknownRiskStore = fakeStore({
        ...state,
        riskAssessmentStatus: {
          exitPoint: ''
        },
        offender: {
          selected: prisonerDetails,
          viperScores: []
        }
      });
      const wrapper = mount(
        <Provider store={unknownRiskStore}>
          <RiskAssessmentSummary />
        </Provider>
      );

      const outcomeText = wrapper.find('[data-risk-assessment-outcome]').text();
      expect(outcomeText).to.contain('Single cell');
    });

    it('allows the user to change answers', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <RiskAssessmentSummary />
        </Provider>
      );

      wrapper.find('[data-change-answers]').simulate('click');

      expect(
        store.dispatch.calledWithMatch({
          type: 'CLEAR_RISK_ASSESSMENT_ANSWERS',
          payload: 'foo-nomis-id'
        })
      ).to.equal(true, 'triggered clear assessment answers');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: {
            method: 'replace',
            args: ['/risk-assessment/introduction']
          }
        })
      ).to.equal(true, 'Changed path to /risk-assessment/introduction');
    });

    context('when the risk assessment is incomplete', () => {
      const store = fakeStore(state);

      it('displays a message informing the user that they need to complete the healthcare assessment', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>
        );

        expect(wrapper.find('[data-summary-next-steps]').text()).to.contain(
          'You must now complete the healthcare questions to get a cell sharing outcome.'
        );

        expect(
          wrapper.find('[data-summary-next-steps] button').text()
        ).to.equal('Submit and return to prisoner list');
      });

      it('on submission it navigates to the prisoner list', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>
        );

        wrapper.find('[data-summary-next-steps] button').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/dashboard'] }
          })
        ).to.equal(true, 'Changed path to /dashboard');
      });
    });

    context('when the risk assessment is complete', () => {
      const storeDataCompleted = {
        ...state,
        healthcareStatus: {
          completed: [{ nomisId: 'foo-nomis-id' }]
        }
      };
      const store = fakeStore(storeDataCompleted);

      it('displays a message informing the user that they can see their assessment outcome', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>
        );

        expect(
          wrapper.find('[data-summary-next-steps] button').text()
        ).to.equal('Submit and complete assessment');
      });

      it('on submission it navigates to the full assessment page', () => {
        const wrapper = mount(
          <Provider store={store}>
            <RiskAssessmentSummary />
          </Provider>
        );

        wrapper.find('[data-summary-next-steps] button').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/full-assessment-complete'] }
          })
        ).to.equal(true, 'Changed path to /full-assessment-complete');
      });
    });
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';


import { fakeStore } from '../test-helpers';

import HealthcareSummary
  from '../../../../client/javascript/pages/HealthcareSummary';

const prisonerDetails = {
  id: 1,
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '1-1-2010',
  nomisId: 'foo-nomisId',
  riskAssessmentCompleted: false,
};

const healthcareAnswers = {
  outcome: {
    answer: 'yes',
  },
  comments: {},
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

const storeData = {
  questions: {
    healthcare: [
      {
        section: 'outcome',
      },
      {
        section: 'comments',
      },
      {
        section: 'consent',
      },
      {
        section: 'assessor',
      },
    ],
  },
  answers: {
    selectedPrisonerId: 'foo-nomisId',
    healthcare: {
      'foo-nomisId': healthcareAnswers,
    },
  },
  offender: {
    selected: prisonerDetails,
    viperScores: [
      {
        nomisId: 'foo-nomisId',
        viperScore: 0.13,
      },
    ],
  },
};

describe('<HealthcareSummary />', () => {
  let putStub;
  before(() => {
    putStub = sinon.stub(xhr, 'put');
    putStub.yields(null, { status: 200 }, { foo: 'bar' });
  });
  after(() => {
    putStub.restore();
  });

  context('Connected HealthcareSummary', () => {
    it('accepts and correctly renders a prisoner`s details', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const prisonerProfile = wrapper.find('[data-element-id="prisoner-profile"]').text();

      expect(prisonerProfile).to.contain('Foo-name');
      expect(prisonerProfile).to.contain('foo-surname');
      expect(prisonerProfile).to.contain('1 January 2010');
      expect(prisonerProfile).to.contain('foo-nomisId');
    });

    context('Healthcare outcome', () => {
      it('correctly renders a high risk outcome', () => {
        const store = fakeStore(storeData);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper
          .find('[data-element-id="healthcare-outcome"]')
          .text();
        expect(healthcareOutcome).to.contain('Single cell');
      });

      it('correctly renders a low risk outcome', () => {
        const healthcareAnswersLow = {
          ...healthcareAnswers,
          outcome: { answer: 'no' },
        };
        const storeDataLow = {
          ...storeData,
          answers: {
            ...storeData.answers,
            healthcare: { 'foo-nomisId': healthcareAnswersLow },
          },
        };
        const store = fakeStore(storeDataLow);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper
          .find('[data-element-id="healthcare-outcome"]')
          .text();
        expect(healthcareOutcome).to.contain('Shared cell');
      });
    });

    context('Healthcare comments', () => {
      it('correctly renders no comments', () => {
        const store = fakeStore(storeData);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper
          .find('[data-element-id="healthcare-comments"]')
          .text();
        expect(healthcareComments).to.contain('None');
      });

      it('correctly renders comments', () => {
        const healthcareAnswersWithComments = {
          ...healthcareAnswers,
          comments: { comments: 'some foo comment' },
        };
        const storeDataLow = {
          ...storeData,
          answers: {
            ...storeData.answers,
            healthcare: { 'foo-nomisId': healthcareAnswersWithComments },
          },
        };
        const store = fakeStore(storeDataLow);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper
          .find('[data-element-id="healthcare-comments"]')
          .text();
        expect(healthcareComments).to.contain('Some foo comment');
      });
    });

    it('correctly renders consent', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareComments = wrapper
        .find('[data-element-id="healthcare-consent"]')
        .text();
      expect(healthcareComments).to.contain('No');
    });

    it('correctly renders assessor details', () => {
      const store = fakeStore(storeData);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareAssessor = wrapper
        .find('[data-healthcare-assessor]')
        .text();
      expect(healthcareAssessor).to.contain('Foo fullname');
      expect(healthcareAssessor).to.contain('Foo role');
      expect(healthcareAssessor).to.contain('20 December 1984');
    });
  });

  context('when the risk assessment is incomplete', () => {
    const store = fakeStore(storeData);

    it('displays a message informing the user that they have to complete the risk assessment', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      expect(wrapper.find('[data-summary-next-steps]').text()).to.contain(
        'You must now complete the risk assessment questions to get a cell sharing outcome.',
      );

      expect(wrapper.find('[data-summary-next-steps] button').text()).to.equal(
        'Submit and return to prisoner list',
      );
    });

    it('on submission it navigates to the prisoner list', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
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

    it('marks the assessment as complete on submission', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      wrapper.find('form').simulate('submit');

      expect(
        store.dispatch.calledWithMatch({
          type: 'COMPLETE_HEALTH_ASSESSMENT',
          payload: { assessmentId: 1, recommendation: 'single cell' },
        }),
      ).to.equal(true, 'triggered complete assessment');
    });
  });

  context('when the risk assessment is complete', () => {
    const storeDataCompleted = {
      ...storeData,
      offender: {
        selected: { ...prisonerDetails, riskAssessmentCompleted: true },
        viperScores: [
          {
            nomisId: 'foo-nomisId',
            viperScore: 0.13,
          },
        ],
      },
    };
    const store = fakeStore(storeDataCompleted);

    it('displays a message informing the user that they can see their assessment outcome', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      expect(wrapper.find('[data-summary-next-steps] button').text()).to.equal(
        'Submit and see cell sharing outcome',
      );
    });

    it('on submission it navigates to the full assessment page', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
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

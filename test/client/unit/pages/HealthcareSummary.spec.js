import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import HealthcareSummary from '../../../../client/javascript/pages/HealthcareSummary';

const prisoner = {
  id: 1,
  forename: 'foo-name',
  surname: 'foo-surname',
  dateOfBirth: '2010-01-01T00:00:00.000Z',
  nomisId: 'foo-nomis-id',
  riskAssessmentCompleted: false,
};

const healthcareAssessment = {
  viperScore: null,
  questions: {
    outcome: {
      questionId: 'outcome',
      question: 'Does healthcare recommend a single cell?',
      answer: 'yes',
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
      answer: 'Foo role, Foo fullname, 4-8-2017',
    },
  },
  outcome: 'single cell',
};

const state = {
  offender: {
    selected: prisoner,
  },
  assessments: {
    healthcare: {
      1: healthcareAssessment,
    },
  },
};

describe('<HealthcareSummary />', () => {
  context('Connected HealthcareSummary', () => {
    it('accepts and correctly renders a prisoner`s details', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const prisonerProfile = wrapper.find('[data-element-id="prisoner-profile"]').text();

      expect(prisonerProfile).to.contain('Foo-name');
      expect(prisonerProfile).to.contain('foo-surname');
      expect(prisonerProfile).to.contain('01 January 2010');
      expect(prisonerProfile).to.contain('foo-nomis-id');
    });

    context('Healthcare outcome', () => {
      it('correctly renders a high risk outcome', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper.find('[data-element-id="healthcare-outcome"]').text();

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'healthcare', id: 1, outcome: 'single cell' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(healthcareOutcome).to.contain('Single cell');
      });

      it('correctly renders a low risk outcome', () => {
        const lowRiskState = {
          ...state,
          assessments: {
            healthcare: {
              1: {
                ...healthcareAssessment,
                questions: {
                  ...healthcareAssessment.questions,
                  outcome: {
                    questionId: 'outcome',
                    question: 'Does healthcare recommend a single cell?',
                    answer: 'no',
                  },
                },
                outcome: 'shared cell',
              },
            },
          },
        };
        const store = fakeStore(lowRiskState);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareOutcome = wrapper.find('[data-element-id="healthcare-outcome"]').text();

        expect(
          store.dispatch.calledWithMatch({
            type: 'STORE_ASSESSMENT_OUTCOME',
            payload: { assessmentType: 'healthcare', id: 1, outcome: 'shared cell' },
          }),
        ).to.equal(true, 'did not triggered STORE_ASSESSMENT_OUTCOME');

        expect(healthcareOutcome).to.contain('Shared cell');
      });
    });

    context('Healthcare comments', () => {
      it('correctly renders no comments', () => {
        const store = fakeStore(state);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper.find('[data-element-id="healthcare-comments"]').text();
        expect(healthcareComments).to.contain('None');
      });

      it('correctly renders comments', () => {
        const stateWithHealthcareComments = {
          ...state,
          assessments: {
            healthcare: {
              1: {
                ...healthcareAssessment,
                questions: {
                  ...healthcareAssessment.questions,
                  comments: {
                    questionId: 'comments',
                    question: 'Enter all the comments on the healthcare form',
                    answer: 'Some foo comment',
                  },
                },
                outcome: 'shared cell',
              },
            },
          },
        };
        const store = fakeStore(stateWithHealthcareComments);
        const wrapper = mount(
          <Provider store={store}>
            <HealthcareSummary />
          </Provider>,
        );
        const healthcareComments = wrapper.find('[data-element-id="healthcare-comments"]').text();
        expect(healthcareComments).to.contain('Some foo comment');
      });
    });

    it('correctly renders consent', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareComments = wrapper.find('[data-element-id="healthcare-consent"]').text();
      expect(healthcareComments).to.contain('No');
    });

    it('correctly renders assessor details', () => {
      const store = fakeStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );
      const healthcareAssessor = wrapper.find('[data-healthcare-assessor]').text();
      expect(healthcareAssessor).to.contain('Foo fullname');
      expect(healthcareAssessor).to.contain('Foo role');
      expect(healthcareAssessor).to.contain('4 August 2017');
    });
  });

  context('when the risk assessment is incomplete', () => {
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
        'Finish assessment',
      );
    });

    it('on submission it navigates to the prisoner list', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      getStub.yields(null, { statusCode: 200 }, { riskAssessment: null });
      putStub.yields(null, { statusCode: 200 });

      expect(wrapper.find('button[type="submit"]').getNode().hasAttribute('disabled')).to.equal(false);

      wrapper.find('form').simulate('submit');

      expect(wrapper.find('button[type="submit"]').getNode().hasAttribute('disabled')).to.equal(true);

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'replace', args: ['/dashboard'] },
        }),
      ).to.equal(true, 'Changed path to /dashboard');
    });

    it('on submission it navigates to the error page when it fails to PUT the assessment', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      getStub.yields(null, { statusCode: 200 }, { riskAssessment: null });
      putStub.yields(null, { statusCode: 500 });

      wrapper.find('form').simulate('submit');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'replace', args: ['/error'] },
        }),
      ).to.equal(true, 'Changed path to /error');
    });

    it('on submission it navigates to the error page when it fails to get an assessment', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      getStub.yields(null, { statusCode: 500 });
      putStub.yields(null, { statusCode: 200 });

      wrapper.find('form').simulate('submit');

      expect(
        store.dispatch.calledWithMatch({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'replace', args: ['/error'] },
        }),
      ).to.equal(true, 'Changed path to /error');
    });
  });

  context('when the risk assessment is complete', () => {
    let store;
    let putStub;
    let getStub;

    const stateCompleted = {
      ...state,
      offender: {
        selected: { ...prisoner, riskAssessmentCompleted: true },
      },
    };

    beforeEach(() => {
      store = fakeStore(stateCompleted);
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
          <HealthcareSummary />
        </Provider>,
      );

      expect(wrapper.find('[data-summary-next-steps] button').text()).to.equal(
        'Finish assessment',
      );
    });

    it('on submission it navigates to the full assessment page', () => {
      const wrapper = mount(
        <Provider store={store}>
          <HealthcareSummary />
        </Provider>,
      );

      getStub.yields(null, { statusCode: 200 }, { riskAssessment: { foo: 'bar' } });
      putStub.yields(null, { statusCode: 200 });

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

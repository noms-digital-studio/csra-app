import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import ConnectedOffenderProfile from '../../../../client/javascript/pages/OffenderProfile';

const selected = {
  id: 1,
  forename: 'forename',
  surname: 'surname',
  dateOfBirth: '1999-11-17T00:00:00',
  nomisId: 'foo-nomis-id',
};

const storeData = {
  offender: { selected },
  assessmentStatus: {
    awaitingSubmission: {
      risk: [],
    },
  },
};

const mountApp = store => mount(
  <Provider store={store}>
    <Router>
      <ConnectedOffenderProfile />
    </Router>
  </Provider>,
);

describe('<OffenderProfile />', () => {
  context('Connected OffenderProfile', () => {
    let store;

    beforeEach(() => {
      store = fakeStore(storeData);
    });

    it('accepts and correctly renders a profile', () => {
      const wrapper = mountApp(store);
      const pageText = wrapper.find('[data-offender-profile-details]').first().text();
      expect(pageText).to.contain('Forename');
      expect(pageText).to.contain('Surname');
      expect(pageText).to.contain('17 November 1999');
      expect(pageText).to.contain('foo-nomis-id');
    });

    context('when user clicks the continue button', () => {
      let getStub;

      beforeEach(() => {
        getStub = sinon.stub(xhr, 'get');
      });

      afterEach(() => getStub.restore());

      it('starts an assessments', () => {
        const wrapper = mountApp(store);

        getStub.yields(null, { statusCode: 200 }, { viperRating: 0.1, nomisId: 'foo-nomis-id' });

        wrapper.find('[data-element-id="continue-button"]').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: 'START_ASSESSMENT',
            payload: {
              id: 1,
              assessmentType: 'risk',
              viperScore: 0.1,
            },
          }),
        ).to.equal(true, 'did not trigger START_ASSESSMENT');
      });

      it('navigate to the first question', () => {
        const wrapper = mountApp(store);

        getStub.yields(null, { statusCode: 200 }, { viperRating: 0.1, nomisId: 'foo-nomis-id' });

        wrapper.find('[data-element-id="continue-button"]').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {
              method: 'push',
              args: ['/risk-assessment/introduction'],
            },
          }),
        ).to.equal(true, 'did not change path to /risk-assessment/introduction');
      });

      context('and the assessment question have already been answered but not submitted', () => {
        it('navigate the the summary page', () => {
          const newStore = fakeStore({
            ...storeData,
            assessmentStatus: {
              awaitingSubmission: {
                risk: [{ assessmentId: 1 }],
              },
            },
          });
          const wrapper = mountApp(newStore);

          getStub.yields(null, { statusCode: 200 }, { viperRating: 0.1, nomisId: 'foo-nomis-id' });

          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(
            newStore.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: {
                method: 'push',
                args: ['/risk-assessment-summary'],
              },
            }),
          ).to.equal(true, 'did not change path to /risk-assessment-summary');
        });
      });
    });
  });
});

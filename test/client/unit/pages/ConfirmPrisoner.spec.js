import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import ConnectedConfirmOffender from '../../../../client/javascript/pages/ConfirmPrisoner';

const prisoner = {
  'first-name': 'foo-first-name',
  'last-name': 'foo-last-name',
  'dob-day': '01',
  'dob-month': '11',
  'dob-year': '1960',
  'nomis-id': 'foo-nomis-id',
};

const mountComponent = store =>
  mount(
    <Provider store={store}>
      <ConnectedConfirmOffender />
    </Provider>,
  );

describe('<ConfirmOffender />', () => {
  context('Connected ConfirmOffender', () => {
    context('when user clicks the continue button', () => {
      context('and a server error is returned', () => {
        it('does not call the addViperScore action', () => {
          const getStub = sinon.stub(xhr, 'get');
          const store = fakeStore({
            offender: {
              prisonerFormData: prisoner,
            },
          });
          const wrapper = mountComponent(store);

          getStub.yields('some error', { status: 500 }, null);
          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: 'ADD_VIPER_SCORE',
              payload: { nomisId: 'foo-nomis-id', viperScore: 0.50 },
            }),
          ).to.equal(false, 'should not have called ADD_VIPER_SCORE action');

          getStub.restore();
        });
      });

      context('and a server returns a success response', () => {
        it('calls the addViperScore action', () => {
          const getStub = sinon.stub(xhr, 'get');
          const store = fakeStore({
            offender: {
              prisonerFormData: prisoner,
            },
          });
          const wrapper = mountComponent(store);

          getStub.yields(null, { status: 200 }, {
            nomisId: 'foo-nomis-id',
            viperRating: 0.50,
          });

          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(getStub.lastCall.args[0]).to.match(/\/api\/viper\/foo-nomis-id/, "the url didn't match");

          expect(
            store.dispatch.calledWithMatch({
              type: 'ADD_VIPER_SCORE',
              payload: { nomisId: 'foo-nomis-id', viperScore: 0.50 },
            }),
          ).to.equal(true, 'did not call the ADD_VIPER_SCORE action');

          getStub.restore();
        });
      });

      context('and any server response is returned', () => {
        it('confirms the added prisoner', () => {
          const getStub = sinon.stub(xhr, 'get');

          const store = fakeStore({
            offender: {
              prisonerFormData: prisoner,
            },
          });
          const prisonerProfile = {
            nomisId: 'foo-nomis-id',
            surname: 'foo-last-name',
            firstName: 'foo-first-name',
            dob: '01-11-1960',
          };
          const wrapper = mountComponent(store);

          getStub.yields('something');
          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: 'CONFIRM_PRISONER',
              payload: prisonerProfile,
            }),
          ).to.equal(true, 'dispatched CONFIRM_PRISONER');

          getStub.restore();
        });

        it('navigates to the dashboard', () => {
          const getStub = sinon.stub(xhr, 'get');
          const store = fakeStore({
            offender: {
              prisonerFormData: prisoner,
            },
          });
          const wrapper = mountComponent(store);

          getStub.yields('something');
          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'replace', args: ['/dashboard'] },
            }),
          ).to.equal(true, 'Changed path to /dashboard');

          getStub.restore();
        });
      });
    });

    it('displays prisoner data on the page', () => {
      const store = fakeStore({
        offender: {
          prisonerFormData: prisoner,
        },
      });
      const wrapper = mountComponent(store);

      Object.keys(prisoner).forEach((key) => {
        expect(wrapper.text()).to.contain(prisoner[key]);
      });
    });
  });
});

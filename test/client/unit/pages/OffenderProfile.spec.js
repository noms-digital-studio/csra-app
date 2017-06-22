import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import superagent from 'superagent';

import { fakeStore } from '../test-helpers';

import ConnectedOffenderProfile
  from '../../../../client/javascript/pages/OffenderProfile';

const selected = {
  firstName: 'forename',
  surname: 'surname',
  dob: '17-Nov-1999',
  nomisId: 'foo-nomis-id',
};

describe('<OffenderProfile />', () => {
  context('Connected OffenderProfile', () => {
    let store;

    beforeEach(() => {
      store = fakeStore({
        offender: {
          selected,
          viperScores: [],
        },
      });
    });

    context('when user clicks the continue button', () => {
      context('and the viperScore is already available in the application state', () => {
        it('does not call the addViperScore action', () => {
          const storeWithViperScore = fakeStore({
            offender: {
              selected,
              viperScores: [{ nomisId: 'foo-nomis-id', viperScore: 0.50 }],
            },
          });
          const wrapper = mount(
            <Provider store={storeWithViperScore}>
              <ConnectedOffenderProfile />
            </Provider>,
          );

          wrapper.find('[data-continue-button]').simulate('click');

          expect(storeWithViperScore.dispatch.calledWithMatch({
            type: 'ADD_VIPER_SCORE',
            payload: { nomisId: 'foo-nomis-id', viperScore: 0.50 },
          })).to.equal(false, 'should not have called ADD_VIPER_SCORE action');

          expect(
            storeWithViperScore.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: {
                method: 'push',
                args: ['/risk-assessment/introduction'],
              },
            }),
          ).to.equal(true, 'Changed path to /risk-assessment/introduction');
        });
      });

      context('and the viperScore is not available in the application state', () => {
        context('and the is server error returned', () => {
          it('does not call the addViperScore action', () => {
            const getStub = sinon.stub(superagent, 'get');
            getStub.yields('some error');

            const storeWithViperScore = fakeStore({
              offender: {
                selected,
                viperScores: [{ nomisId: 'foo-nomis-id', viperScore: 0.50 }],
              },
            });
            const wrapper = mount(
              <Provider store={storeWithViperScore}>
                <ConnectedOffenderProfile />
              </Provider>,
            );

            wrapper.find('[data-continue-button]').simulate('click');

            expect(storeWithViperScore.dispatch.calledWithMatch({
              type: 'ADD_VIPER_SCORE',
              payload: { nomisId: 'foo-nomis-id', viperScore: 0.50 },
            })).to.equal(false, 'should not have called ADD_VIPER_SCORE action');

            expect(
              storeWithViperScore.dispatch.calledWithMatch({
                type: '@@router/CALL_HISTORY_METHOD',
                payload: {
                  method: 'push',
                  args: ['/risk-assessment/introduction'],
                },
              }),
            ).to.equal(true, 'Changed path to /risk-assessment/introduction');

            getStub.restore();
          });
        });
      });

      context('and the viperScore is not available in the application state', () => {
        it('calls the addViperScore action', () => {
          const getStub = sinon.stub(superagent, 'get');
          getStub.yields(null, {
            body: {
              nomisId: 'foo-nomis-id',
              viperScore: 0.50,
            },
          });

          const wrapper = mount(
            <Provider store={store}>
              <ConnectedOffenderProfile />
            </Provider>,
          );

          wrapper.find('[data-continue-button]').simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: 'ADD_VIPER_SCORE',
              payload: { nomisId: 'foo-nomis-id', viperScore: 0.50 },
            }),
          ).to.equal(true, 'should have called ADD_VIPER_SCORE action');

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: {
                method: 'push',
                args: ['/risk-assessment/introduction'],
              },
            }),
          ).to.equal(true, 'Changed path to /risk-assessment/introduction');

          getStub.restore();
        });
      });
    });

    it('accepts and correctly renders a profile', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedOffenderProfile />
        </Provider>,
      );
      const pageText = wrapper
        .find('[data-offender-profile-details]')
        .first()
        .text();
      expect(pageText).to.contain('forename');
      expect(pageText).to.contain('surname');
      expect(pageText).to.contain('17-Nov-1999');
      expect(pageText).to.contain('foo-nomis-id');
    });
  });
});

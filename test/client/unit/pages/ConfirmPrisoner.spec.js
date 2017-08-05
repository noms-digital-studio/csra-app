import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import xhr from 'xhr';

import { fakeStore } from '../test-helpers';

import ConnectedConfirmOffender from '../../../../client/javascript/pages/ConfirmPrisoner';

const prisoner = {
  forename: 'foo-forename',
  surname: 'foo-surname',
  'dob-day': '1',
  'dob-month': '11',
  'dob-year': '1960',
  nomisId: 'foo-nomisId',
};

const mountComponent = store =>
  mount(
    <Provider store={store}>
      <ConnectedConfirmOffender />
    </Provider>,
  );

describe('<ConfirmOffender />', () => {
  let postStub;
  let getStub;
  const store = fakeStore({
    offender: {
      prisonerFormData: prisoner,
    },
  });

  beforeEach(() => {
    postStub = sinon.stub(xhr, 'post');
    getStub = sinon.stub(xhr, 'get');
  });

  afterEach(() => {
    postStub.restore();
    getStub.restore();
  });

  context('Connected ConfirmOffender', () => {
    context('when user clicks the continue button', () => {
      context('and a server error is returned', () => {
        it('does not add a prisoner successfully', () => {
          const wrapper = mountComponent(store);

          postStub.yields('some error', { status: 500 }, null);

          wrapper.find('[data-element-id="continue-button"]').simulate('click');

          expect(
            store.dispatch.calledWithMatch({
              type: 'ADD_VIPER_SCORE',
              payload: { nomisId: 'foo-nomisId', viperScore: 0.50 },
            }),
          ).to.equal(false, 'should not have called ADD_VIPER_SCORE action');

          expect(
            store.dispatch.calledWithMatch({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'replace', args: ['/error'] },
            }),
          ).to.equal(true, 'Changed path to /error');

          postStub.restore();
        });
      });
    });

    it('displays prisoner data on the page', () => {
      const wrapper = mountComponent(store);
      const pageText = wrapper.text();

      expect(pageText).to.contain('1 November 1960');
      expect(pageText).to.contain('foo-forename');
      expect(pageText).to.contain('foo-surname');
      expect(pageText).to.contain('foo-nomisId');
    });
  });
});

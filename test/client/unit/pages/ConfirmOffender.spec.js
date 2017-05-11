import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedConfirmOffender, {
  ConfirmOffender,
} from '../../../src/javascript/pages/ConfirmOffender';

const prisoner = {
  'first-name': 'foo-first-name',
  'last-name': 'foo-last-name',
  'dob-day': '01',
  'dob-month': '11',
  'dob-year': '1960',
  'nomis-id': 'foo-nomis-id',
};

const mountComponent = store => mount(
  <Provider store={store}>
    <ConnectedConfirmOffender />
  </Provider>,
);

describe('<ConfirmOffender />', () => {
  context('Standalone ConfirmOffender', () => {
    it('calls onSubmit callback when user clicks Confirm', () => {
      const callback = sinon.spy();
      const wrapper = mount(<ConfirmOffender prisonerDetails={prisoner} onClick={callback} />);

      wrapper.find('[data-confirm]').simulate('click');

      expect(callback.calledOnce).to.equal(true, 'ConfirmOffender onClick clicked once');
      expect(callback.calledWith(prisoner));
    });

    it('displays prisoner data in the page', () => {
      const wrapper = mount(<ConfirmOffender prisonerDetails={prisoner} />);
      Object.keys(prisoner).forEach((key) => {
        expect(wrapper.text()).to.contain(prisoner[key]);
      });
    });
  });

  context('Connected ConfirmOffender', () => {
    context('When form is empty', () => {
      let wrapper;
      let store;
      beforeEach(() => {
        store = fakeStore({
          offender: {
            prisonerFormData: prisoner,
          },
        });

        wrapper = mountComponent(store);
      });

      it('calls onClick callback when user clicks Confirm', () => {
        const newProfile = {
          NOMS_Number: 'foo-nomis-id',
          Surname: 'foo-last-name',
          First_Name: 'foo-first-name',
          Date_of_Birth: '01-11-1960',
        };

        wrapper.find('[data-confirm]').simulate('click');

        expect(
          store.dispatch.calledWithMatch({ type: 'CONFIRM_PRISONER', payload: newProfile }),
        ).to.equal(true, 'dispatched CONFIRM_PRISONER');
        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/dashboard'] },
          }),
        ).to.equal(true, 'Changed path to /dashboard');
      });

      it('displays prisoner data in the page', () => {
        Object.keys(prisoner).forEach((key) => {
          expect(wrapper.text()).to.contain(prisoner[key]);
        });
      });
    });
  });
});

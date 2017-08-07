import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedAddPrisoner, { AddPrisoner } from '../../../../client/javascript/pages/AddPrisoner';

const prisoner = {
  forename: 'foo-forename',
  surname: 'foo-surname',
  'dob-day': '01',
  'dob-month': '11',
  'dob-year': '1960',
  nomisId: 'foo-nomisId',
};

const populateForm = (wrapper) => {
  Object.keys(prisoner).forEach((key) => {
    const node = wrapper.find(`input[name="${key}"]`).node;
    node.value = prisoner[key];
  });
};

const mountComponent = store => mount(
  <Provider store={store}>
    <ConnectedAddPrisoner />
  </Provider>,
);

const assertFormFieldsArePopulated = (wrapper) => {
  Object.keys(prisoner).forEach((key) => {
    expect(wrapper.find(`input[name="${key}"]`).node.value).to.equal(prisoner[key]);
  });
};

describe('<AddPrisoner />', () => {
  context('Standalone AddPrisoner', () => {
    it('fails to submit if fields are missing in the form', () => {
      const callback = sinon.spy();
      const wrapper = mount(<AddPrisoner onSubmit={callback} />);

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(false, 'onSubmit not called');
    });

    it('calls onSubmit callback when form submits successfully', () => {
      const callback = sinon.spy();
      const wrapper = mount(<AddPrisoner onSubmit={callback} />);

      populateForm(wrapper);

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(true, 'onSubmit called');
      expect(callback.calledWith(prisoner));
    });

    it('displays prisoner data in the form', () => {
      const wrapper = mount(<AddPrisoner prisonerDetails={prisoner} />);
      assertFormFieldsArePopulated(wrapper);
    });
  });

  context('Connected AddPrisoner', () => {
    context('When form is empty', () => {
      it('calls onSubmit callback when form submits successfully', () => {
        const store = fakeStore({
          offender: {
            prisonerFormData: {},
          },
        });

        const wrapper = mountComponent(store);

        populateForm(wrapper);
        wrapper.find('form').simulate('submit');

        expect(
          store.dispatch.calledWithMatch({ type: 'ADD_PRISONER', payload: prisoner }),
        ).to.equal(true, 'Dispatched ADD_PRISONER');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'push', args: ['/confirm-offender'] },
          }),
        ).to.equal(true, 'Changed path to /confirm-offender');
      });
    });

    context('When form is pre-populated', () => {
      it('displays prisoner data in the form', () => {
        const store = fakeStore({
          offender: {
            prisonerFormData: prisoner,
          },
        });

        assertFormFieldsArePopulated(mountComponent(store));
      });
    });
  });
});

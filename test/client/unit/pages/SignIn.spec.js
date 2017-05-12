import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { fakeStore } from '../test-helpers';

import ConnectedSignIn, { SignIn } from '../../../../client/javascript/pages/SignIn';

describe('<SignIn />', () => {
  context('Standalone Sign', () => {
    it('fails to sign in if an empty form is submitted', () => {
      const callback = sinon.spy();
      const wrapper = mount(<SignIn onSubmit={callback} />);

      wrapper.find('form').simulate('submit');

      expect(callback.calledOnce).to.equal(false);
    });

    context('when a username has been provided to the sign in form', () => {
      it('submits the form with the username', () => {
        const callback = sinon.spy();
        const wrapper = mount(<SignIn onSubmit={callback} />);
        const form = wrapper.find('form');
        const name = 'Foo Bar';

        form.find('[name="username"]').node.value = name;

        form.simulate('submit');

        expect(callback.calledOnce).to.equal(true);
        expect(callback.calledWith(name)).to.equal(true);
      });
    });
  });

  context('Connected Sign In', () => {
    let wrapper;
    let store;

    beforeEach(() => {
      store = fakeStore({});

      wrapper = mount(
        <Provider store={store}>
          <ConnectedSignIn />
        </Provider>,
      );
    });

    context('when a username has been provided to the sign in form', () => {
      it('submits the form with the username', () => {
        const form = wrapper.find('form');
        const name = 'Foo Bar';

        form.find('[name="username"]').node.value = name;

        form.simulate('submit');

        expect(store.dispatch.calledWithMatch({ type: 'SIGN_IN', payload: name })).to.equal(true);

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/before-you-start'] },
          }),
        ).to.be.equal(true, 'Navigated to /before-you-start');
      });
    });
  });
});

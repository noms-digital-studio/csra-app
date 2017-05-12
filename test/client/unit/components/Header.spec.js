import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import ConnectedHeader, { Header } from '../../../../client/javascript/components/Header';
import { fakeStore } from '../test-helpers';

describe('<Header />', () => {
  context('Standalone Header', () => {
    context('when signed out', () => {
      it('does not render a username', () => {
        const wrapper = mount(<Header username="Foo Bar" />);

        expect(wrapper.text()).to.not.contain('Foo Bar');
      });
    });

    context('when signed in', () => {
      it('renders a username', () => {
        const wrapper = mount(<Header signedIn username="Foo Bar" />);

        expect(wrapper.text()).to.contain('Foo Bar');
      });

      it('accepts a logout action', () => {
        const callback = sinon.spy();
        const wrapper = mount(<Header signedIn username="Foo Bar" onSignOut={callback} />);

        wrapper.find('[data-sign-out]').simulate('click');

        expect(callback.calledOnce).to.be.true;
      });
    });
  });

  context('Connected Header', () => {
    let wrapper;
    let store;

    beforeEach(() => {
      store = fakeStore({
        login: {
          signedIn: true,
          currentUser: {
            name: 'Foo Bar',
          },
        },
      });

      wrapper = mount(
        <Provider store={store}>
          <ConnectedHeader />
        </Provider>,
      );
    });

    context('when signed in', () => {
      it('renders a username', () => {
        expect(wrapper.text()).to.contain('Foo Bar');
      });

      it('accepts a logout action', () => {
        wrapper.find('[data-sign-out]').simulate('click');

        expect(store.dispatch.calledWithMatch({ type: 'SIGN_OUT' })).to.be.true;

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: { method: 'replace', args: ['/sign-in'] },
          }),
        ).to.be.true;
      });
    });
  });
});

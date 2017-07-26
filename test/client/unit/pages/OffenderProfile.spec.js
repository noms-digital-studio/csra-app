import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedOffenderProfile
  from '../../../../client/javascript/pages/OffenderProfile';

const selected = {
  forename: 'forename',
  surname: 'surname',
  dateOfBirth: '17-Nov-1999',
  nomisId: 'foo-nomis-id',
};

describe('<OffenderProfile />', () => {
  context('Connected OffenderProfile', () => {
    let store;

    beforeEach(() => {
      store = fakeStore({
        offender: { selected },
      });
    });

    context('when user clicks the continue button', () => {
      it('navigate to the dashboard', () => {
        const wrapper = mount(
          <Provider store={store}>
            <ConnectedOffenderProfile />
          </Provider>,
        );

        wrapper.find('[data-element-id="continue-button"]').simulate('click');

        expect(
          store.dispatch.calledWithMatch({
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {
              method: 'push',
              args: ['/risk-assessment/introduction'],
            },
          }),
        ).to.equal(true, 'Changed path to /risk-assessment/introduction');
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

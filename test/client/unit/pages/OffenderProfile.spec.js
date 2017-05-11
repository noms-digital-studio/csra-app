import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';

import { fakeStore } from '../test-helpers';

import ConnectedOffenderProfile, {
  OffenderProfile,
} from '../../../src/javascript/pages/OffenderProfile';

const selected = {
  First_Name: 'forename',
  Surname: 'surname',
  Date_of_Birth: '17-Nov-1999',
  NOMS_Number: 'AA54321XX',
};

describe('<OffenderProfile />', () => {
  context('Standalone OffenderProfile', () => {
    it('accepts and correctly renders a profile', () => {
      const wrapper = shallow(<OffenderProfile details={selected} />);
      const pageText = wrapper.find('[data-offender-profile-details]').first().text();
      expect(pageText).to.contain('forename');
      expect(pageText).to.contain('surname');
      expect(pageText).to.contain('17-Nov-1999');
      expect(pageText).to.contain('AA54321XX');
    });
  });

  context('Connected OffenderProfile', () => {
    let wrapper;
    let store;

    beforeEach(() => {
      store = fakeStore({
        offender: {
          selected,
        },
      });

      wrapper = mount(
        <Provider store={store}>
          <ConnectedOffenderProfile />
        </Provider>,
      );
    });

    it('accepts and correctly renders a profile', () => {
      const pageText = wrapper.find('[data-offender-profile-details]').first().text();
      expect(pageText).to.contain('forename');
      expect(pageText).to.contain('surname');
      expect(pageText).to.contain('17-Nov-1999');
      expect(pageText).to.contain('AA54321XX');
    });
  });
});

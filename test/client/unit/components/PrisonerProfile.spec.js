import React from 'react';
import { shallow } from 'enzyme';

import PrisonerProfile
  from '../../../../client/javascript/components/PrisonerProfile';

describe('<PrisonerProfile />', () => {
  it('renders the prisoners profile details', () => {
    const prisonerDetails = {
      firstName: 'foo-name',
      surname: 'foo-surname',
      dob: 'foo-date',
      nomisId: 'foo-nomis-id',
    };

    const wrapper = shallow(<PrisonerProfile {...prisonerDetails} />);

    const profileText = wrapper.find('[data-profile]').text();
    expect(profileText).to.contain('foo-name');
    expect(profileText).to.contain('foo-surname');
    expect(profileText).to.contain('foo-date');
    expect(profileText).to.contain('foo-nomis-id');
  });
});

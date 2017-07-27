import React from 'react';
import { shallow } from 'enzyme';

import PrisonerProfile
  from '../../../../client/javascript/components/PrisonerProfile';

describe('<PrisonerProfile />', () => {
  it('renders the prisoners profile details', () => {
    const prisonerDetails = {
      forename: 'foo-name',
      surname: 'foo-surname',
      dateOfBirth: '1-1-2010',
      nomisId: 'foo-nomisId',
    };

    const wrapper = shallow(<PrisonerProfile {...prisonerDetails} />);

    const profileText = wrapper.find('[data-element-id="prisoner-profile"]').text();
    expect(profileText).to.contain('Foo-name');
    expect(profileText).to.contain('foo-surname');
    expect(profileText).to.contain('1 January 2010');
    expect(profileText).to.contain('foo-nomisId');
  });
});

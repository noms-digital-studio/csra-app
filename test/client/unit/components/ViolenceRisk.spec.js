import React from 'react';
import { mount } from 'enzyme';

import { ViolenceRisk } from '../../../src/javascript/components/asides/ViolenceRisk';

describe('<ViolenceRisk />', () => {
  it('renders the component with a high viper rating', () => {
    const wrapper = mount(<ViolenceRisk rating="high" />);

    expect(wrapper.find('[data-viper-rating]').first().text()).to.equal('High risk');
  });

  it('renders the component with a low viper rating', () => {
    const wrapper = mount(<ViolenceRisk rating="low" />);

    expect(wrapper.find('[data-viper-rating]').first().text()).to.equal('Low risk');
  });

  it('renders the component with an unknown viper rating', () => {
    const wrapper = mount(<ViolenceRisk rating="" />);

    expect(wrapper.find('[data-viper-rating]').first().text()).to.equal('We can\'t find this prisoner');
  });
});

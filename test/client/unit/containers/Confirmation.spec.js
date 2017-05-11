import React from 'react';
import { mount } from 'enzyme';

import Confirmation from '../../../src/javascript/containers/Confirmation';

describe('<Confirmation />', () => {
  it('renders the title', () => {
    const wrapper = mount(<Confirmation title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<Confirmation description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<Confirmation onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.be.true;
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(<Confirmation formDefaults={{ confirmation: 'accepted' }} />);

    expect(wrapper.find('input[type="checkbox"]').node.checked).to.equal(
      true,
      'Check box is checked',
    );
  });
});

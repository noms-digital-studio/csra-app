import React from 'react';
import { mount } from 'enzyme';

import CofirmationWithAside from '../../../../client/javascript/containers/ConfirmationWithAside';
import Aside from '../../../../client/javascript/components/asides/Index';

describe('<CofirmationWithAside />', () => {
  it('renders the title', () => {
    const wrapper = mount(<CofirmationWithAside title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<CofirmationWithAside description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('renders the an aside', () => {
    const props = {
      template: 'template',
    };
    const wrapper = mount(<CofirmationWithAside aside={props} />);
    expect(wrapper.find(Aside).length).be.equal(1);
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<CofirmationWithAside onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.be.true;
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(<CofirmationWithAside formDefaults={{ confirmation: 'accepted' }} />);

    expect(wrapper.find('input[type="checkbox"]').node.checked).to.equal(true, 'Check box is checked');
  });
});

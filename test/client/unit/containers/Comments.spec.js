import React from 'react';
import { mount } from 'enzyme';

import Comments from '../../../../client/javascript/containers/Comments';

describe('<Comments />', () => {
  it('renders the title', () => {
    const wrapper = mount(<Comments title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<Comments description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<Comments onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.be.true;
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(<Comments formDefaults={{ comments: 'foo-comment' }} />);

    expect(wrapper.find('[data-element="commentBox"]').node.value).to.equal('foo-comment');
  });
});

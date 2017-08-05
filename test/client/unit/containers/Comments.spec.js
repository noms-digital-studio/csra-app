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

    expect(callback.calledOnce).to.equal(true);
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(
      <Comments formDefaults={{ answer: 'foo-comment' }} />,
    );

    expect(wrapper.find('[data-element="commentBox"]').node.value).to.equal(
      'foo-comment',
    );
  });

  context('when the isComplete prop is present', () => {
    it('display "Save" on the submission button', () => {
      const wrapper = mount(<Comments isComplete />);

      expect(wrapper.find('input[type="submit"]').node.value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Save and continue" on the submission button', () => {
      const wrapper = mount(<Comments />);
      expect(wrapper.find('input[type="submit"]').node.value).to.equal(
        'Save and continue',
      );
    });
  });
});

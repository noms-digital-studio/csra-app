import React from 'react';
import { mount } from 'enzyme';

import CommentBox from '../../../../client/javascript/components/CommentBox';

describe('<CommentBox />', () => {
  it('accepts a character limit', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-element-id="character-limit"]');

    expect(characterLimitBox.text()).to.include('30 characters left');
  });

  it('accepts default text for <textarea />', () => {
    const wrapper = mount(<CommentBox text="foo" />);

    expect(wrapper.find('textarea').getDOMNode().value).to.include('foo');
  });

  it('accepts a name for <textarea />', () => {
    const wrapper = mount(<CommentBox name="foo" />);
    expect(wrapper.find('textarea').getDOMNode().name).to.include('foo');
  });

  it('sets the characters left based on initial text', () => {
    const wrapper = mount(<CommentBox limit={30} text="foo" />);
    const characterLimitBox = wrapper.find('[data-element-id="character-limit"]');

    expect(characterLimitBox.text()).to.include('27 characters left');
  });

  it('updates the character left count when text is changed in <textarea />', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-element-id="character-limit"]');
    expect(characterLimitBox.text()).to.include('30 characters left');

    wrapper.find('textarea').simulate('change', { target: { value: 'foo' } });

    expect(characterLimitBox.text()).to.include('27 characters left');
  });

  it('updates the character left count when text is pasted into <textarea />', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-element-id="character-limit"]');
    expect(characterLimitBox.text()).to.include('30 characters left');

    wrapper.find('textarea').simulate('paste', { target: { value: 'foo' } });

    expect(characterLimitBox.text()).to.include('27 characters left');
  });

  it('focus on the element on component mount', () => {
    const wrapper = mount(<CommentBox id="foo" limit={30} autofocus />);
    const commentInput = wrapper.find('[data-element="foo"]');
    const focusedElement = document.activeElement;

    expect(commentInput.matchesElement(focusedElement)).to.equal(true, 'The comment box was not focused');
  });
});

import React from 'react';
import { mount } from 'enzyme';

import CommentBox from '../../../../client/javascript/components/CommentBox';

describe('<CommentBox />', () => {
  it('accepts a character limit', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-character-limit]');

    expect(characterLimitBox.text()).to.include('30 characters left');
  });

  it('accepts default text for <textarea />', () => {
    const wrapper = mount(<CommentBox text="foo" />);
    expect(wrapper.find('textarea').node.value).to.include('foo');
  });

  it('accepts a name for <textarea />', () => {
    const wrapper = mount(<CommentBox name="foo" />);
    expect(wrapper.find('textarea').node.name).to.include('foo');
  });

  it('sets the characters left based on initial text', () => {
    const wrapper = mount(<CommentBox limit={30} text="foo" />);
    const characterLimitBox = wrapper.find('[data-character-limit]');

    expect(characterLimitBox.text()).to.include('27 characters left');
  });

  it('updates the character left count when text is changed in <textarea />', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-character-limit]');
    expect(characterLimitBox.text()).to.include('30 characters left');

    wrapper.find('textarea').simulate('change', { target: { value: 'foo' } });

    expect(characterLimitBox.text()).to.include('27 characters left');
  });

  it('updates the character left count when text is pasted into <textarea />', () => {
    const wrapper = mount(<CommentBox limit={30} />);
    const characterLimitBox = wrapper.find('[data-character-limit]');
    expect(characterLimitBox.text()).to.include('30 characters left');

    wrapper.find('textarea').simulate('paste', { target: { value: 'foo' } });

    expect(characterLimitBox.text()).to.include('27 characters left');
  });
});

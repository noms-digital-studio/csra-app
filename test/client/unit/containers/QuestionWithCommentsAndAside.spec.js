import React from 'react';
import { mount } from 'enzyme';

import QuestionWithCommentAndAside from '../../../../client/javascript/containers/QuestionWithCommentAndAside';
import Aside from '../../../../client/javascript/components/asides/Index';

describe('<QuestionWithCommentAndAside />', () => {
  it('renders the title', () => {
    const wrapper = mount(<QuestionWithCommentAndAside title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<QuestionWithCommentAndAside description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('renders the an aside', () => {
    const props = {
      template: 'template',
    };
    const wrapper = mount(<QuestionWithCommentAndAside aside={props} />);
    expect(wrapper.find(Aside).length).be.equal(1);
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<QuestionWithCommentAndAside onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.equal(true);
  });

  it('displays a comment box when the yes radio button is selected', () => {
    const wrapper = mount(<QuestionWithCommentAndAside />);

    expect(wrapper.find('textarea').length).to.equal(0, 'Did not expect to find a text area before the radio button was clicked');

    wrapper
      .find('[data-input="yes"]')
      .simulate('change', { target: { value: 'yes' } });

    expect(wrapper.find('textarea').length).to.equal(1, 'Expected to find a text area after radio button clicked');
  });

  it('pre-populates the forms if data is available for Yes answers', () => {
    const wrapper = mount(<QuestionWithCommentAndAside formDefaults={{ answer: 'yes', 'reasons-yes': 'foobar-yes' }} />);

    expect(wrapper.find('[data-input="yes"]').getDOMNode().checked).to.equal(
      true,
      'radio button selected',
    );

    expect(wrapper.find('[data-element="reason-for-answer"]').getDOMNode().value).to.equal('foobar-yes');
  });

  it('pre-populates the forms if data is available for No answers', () => {
    const wrapper = mount(<QuestionWithCommentAndAside formDefaults={{ answer: 'no', 'reasons-no': 'foobar-no' }} />);

    expect(wrapper.find('[data-input="no"]').getDOMNode().checked).to.equal(
      true,
      'radio button selected',
    );

    expect(wrapper.find('[data-element="reason-for-answer"]').getDOMNode().value).to.equal('foobar-no');
  });

  it('accepts radio button label text', () => {
    const wrapper = mount(<QuestionWithCommentAndAside
      formFields={{
          input: { yes: { text: 'foo-text' }, no: { text: 'bar-text' } },
        }}
    />);

    expect(wrapper.find('[data-label="yes"]').text()).to.equal('foo-text');
    expect(wrapper.find('[data-label="no"]').text()).to.equal('bar-text');
  });

  context('when the isComplete prop is present', () => {
    it('display "Save" on the submission button', () => {
      const wrapper = mount(<QuestionWithCommentAndAside isComplete />);

      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Save and continue" on the submission button', () => {
      const wrapper = mount(<QuestionWithCommentAndAside />);
      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Save and continue');
    });
  });
});

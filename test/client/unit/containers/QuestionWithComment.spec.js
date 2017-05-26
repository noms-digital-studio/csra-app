import React from 'react';
import { mount } from 'enzyme';

import QuestionWithComment from '../../../../client/javascript/containers/QuestionWithComment';

describe('<QuestionWithComment />', () => {
  it('renders the title', () => {
    const wrapper = mount(<QuestionWithComment title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<QuestionWithComment description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });


  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<QuestionWithComment onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.equal(true);
  });

  it('displays a comment box when the yes radio button is selected', () => {
    const wrapper = mount(<QuestionWithComment />);

    expect(wrapper.find('textarea').length).to.equal(0, 'Did not expect to find a text area before the radio button was clicked');

    wrapper
      .find('#radio-yes')
      .simulate('change', { target: { value: 'yes' } });

    expect(wrapper.find('textarea').length).to.equal(1, 'Expected to find a text area after radio button clicked');
  });

  it('pre-populates the forms if data is available for Yes answers', () => {
    const wrapper = mount(
      <QuestionWithComment formDefaults={{ answer: 'yes', 'reasons-yes': 'foobar-yes' }} />,
    );

    expect(wrapper.find('[data-input="yes"]').node.checked).to.equal(
      true,
      'radio button selected',
    );

    expect(wrapper.find('[data-element="reason-for-answer"]').node.value).to.equal(
      'foobar-yes',
    );
  });

  it('pre-populates the forms if data is available for No answers', () => {
    const wrapper = mount(
      <QuestionWithComment formDefaults={{ answer: 'no', 'reasons-no': 'foobar-no' }} />,
    );

    expect(wrapper.find('[data-input="no"]').node.checked).to.equal(
      true,
      'radio button selected',
    );

    expect(wrapper.find('[data-element="reason-for-answer"]').node.value).to.equal(
      'foobar-no',
    );
  });

  it('accepts radio button label text', () => {
    const wrapper = mount(
      <QuestionWithComment
        formFields={{
          input: { yes: { text: 'foo-text' }, no: { text: 'bar-text' } },
        }}
      />,
    );

    expect(wrapper.find('[data-label="yes"]').text()).to.equal('foo-text');
    expect(wrapper.find('[data-label="no"]').text()).to.equal('bar-text');
  });

  context('when the isComplete prop is present', () => {
    it('display "Save" on the submission button', () => {
      const wrapper = mount(<QuestionWithComment isComplete />);

      expect(wrapper.find('input[type="submit"]').node.value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Save and continue" on the submission button', () => {
      const wrapper = mount(<QuestionWithComment />);
      expect(wrapper.find('input[type="submit"]').node.value).to.equal('Save and continue');
    });
  });
});

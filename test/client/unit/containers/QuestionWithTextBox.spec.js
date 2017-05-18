import React from 'react';
import { mount } from 'enzyme';

import QuestionWithComments from '../../../../client/javascript/containers/QuestionWithTextBox';
import Aside from '../../../../client/javascript/components/asides/Index';

describe('<QuestionWithComments />', () => {
  it('renders the title', () => {
    const wrapper = mount(<QuestionWithComments title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<QuestionWithComments description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('renders the an aside', () => {
    const props = {
      template: 'template',
    };
    const wrapper = mount(<QuestionWithComments aside={props} />);
    expect(wrapper.find(Aside).length).be.equal(1);
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<QuestionWithComments onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.equal(true, 'form submitted');
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(<QuestionWithComments formDefaults={{ answer: 'yes', comments: 'foo-comment' }} />);

    expect(wrapper.find('[data-input="yes"]').node.checked).to.equal(true, 'radio button selected');

    expect(wrapper.find('textarea').node.value).to.equal('foo-comment');
  });

  it('accepts radio button label text', () => {
    const wrapper = mount(
      <QuestionWithComments
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
      const wrapper = mount(<QuestionWithComments isComplete />);

      expect(wrapper.find('input[type="submit"]').node.value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Save and continue" on the submission button', () => {
      const wrapper = mount(<QuestionWithComments />);
      expect(wrapper.find('input[type="submit"]').node.value).to.equal('Save and continue');
    });
  });
});

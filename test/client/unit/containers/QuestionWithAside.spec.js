import React from 'react';
import { mount } from 'enzyme';

import QuestionWithAside
  from '../../../../client/javascript/containers/QuestionWithAside';
import Aside from '../../../../client/javascript/components/asides/Index';

describe('<QuestionWithAside />', () => {
  it('renders the title', () => {
    const wrapper = mount(<QuestionWithAside title="foo-title" />);
    expect(wrapper.text()).to.contain('foo-title');
  });

  it('renders the description', () => {
    const wrapper = mount(<QuestionWithAside description="foo-description" />);
    expect(wrapper.text()).to.contain('foo-description');
  });

  it('renders the an aside', () => {
    const props = {
      template: 'template',
    };
    const wrapper = mount(<QuestionWithAside aside={props} />);
    expect(wrapper.find(Aside).length).be.equal(1);
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<QuestionWithAside onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.equal(true);
  });

  it('pre-populates the forms if data is available', () => {
    const wrapper = mount(
      <QuestionWithAside formDefaults={{ answer: 'yes' }} />,
    );

    expect(wrapper.find('[data-input="yes"]').getDOMNode().checked).to.equal(
      true,
      'radio button selected',
    );
  });

  it('accepts radio button label text', () => {
    const wrapper = mount(
      <QuestionWithAside
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
      const wrapper = mount(<QuestionWithAside isComplete />);

      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Save and continue" on the submission button', () => {
      const wrapper = mount(<QuestionWithAside />);
      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Save and continue');
    });
  });
});

import React from 'react';
import { mount } from 'enzyme';

import Viper from '../../../../client/javascript/containers/Viper';

describe('<Viper />', () => {
  const content = {
    low: {
      title: 'low title',
      description: 'low desc',
    },
    high: {
      title: 'high title',
      description: 'high desc',
    },
    unknown: {
      title: 'unknown title',
      description: 'unknown desc',
    },

  };

  it('renders the title for low viper rating', () => {
    const wrapper = mount(<Viper content={content} viperScore="low" />);
    expect(wrapper.text()).to.contain('low title');
  });

  it('renders the title for high viper rating', () => {
    const wrapper = mount(<Viper content={content} viperScore="high" />);
    expect(wrapper.text()).to.contain('high title');
  });

  it('renders the title for unknown viper rating', () => {
    const wrapper = mount(<Viper content={content} viperScore="unknown" />);
    expect(wrapper.text()).to.contain('unknown title');
  });

  it('renders the description for low viper rating', () => {
    const wrapper = mount(<Viper content={content} viperScore="low" />);
    expect(wrapper.text()).to.contain('low desc');
  });

  it('renders the description for high viper rating', () => {
    const wrapper = mount(<Viper content={content} viperScore="high" />);
    expect(wrapper.text()).to.contain('high desc');
  });

  it('handles form submission', () => {
    const callback = sinon.spy();
    const wrapper = mount(<Viper content={content} viperScore="high" onSubmit={callback} />);

    wrapper.find('form').simulate('submit');

    expect(callback.calledOnce).to.equal(true);
  });


  context('when the isComplete prop is present', () => {
    it('display "Save" on the submission button', () => {
      const wrapper = mount(<Viper content={content} viperScore="low" isComplete />);

      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Save');
    });
  });

  context('when the isComplete prop is not present', () => {
    it('display "Continue to questions" on the submission button', () => {
      const wrapper = mount(<Viper content={content} viperScore="low" />);
      expect(wrapper.find('input[type="submit"]').getDOMNode().value).to.equal('Continue to questions');
    });
  });
});

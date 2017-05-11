import React from "react";
import { mount } from "enzyme";

import HealthcareAssessor
  from "../../../src/javascript/containers/HealthcareAssessor";
import Aside from "../../../src/javascript/components/asides/Index";

describe("<HealthcareAssessor />", () => {
  it("renders the title", () => {
    const wrapper = mount(<HealthcareAssessor title="foo-title" />);
    expect(wrapper.text()).to.contain("foo-title");
  });

  it("renders the an aside", () => {
    const props = {
      template: "static",
      title: "foo-bar-aside",
      description: "foo-description"
    };
    const wrapper = mount(<HealthcareAssessor aside={props} />);

    expect(wrapper.find(Aside).length).be.equal(1);
    expect(wrapper.find(Aside).text()).be.include("foo-bar-aside");
    expect(wrapper.find(Aside).text()).be.include("foo-description");
  });

  it("handles form submission", () => {
    const callback = sinon.spy();
    const wrapper = mount(<HealthcareAssessor onSubmit={callback} />);

    wrapper.find("form").simulate("submit");

    expect(callback.calledOnce).to.be.true;
  });

  it("pre-populates the forms if data is available", () => {
    const formDefaults = {
      role: "foo-role",
      "full-name": "foo-name",
      "day": "01",
      "month": "11",
      "year": "1991"
    };
    const wrapper = mount(
      <HealthcareAssessor
        formDefaults={formDefaults}
      />
    );

    Object.keys(formDefaults).forEach(key => {
      expect(wrapper.find(`[data-input="${key}"]`).node.value).to.equal(
        formDefaults[key],
        `${key} value field filled`
      );
    });
  });
});

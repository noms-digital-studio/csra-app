import React from 'react';
import { mount } from 'enzyme';

import FullAssessmentOutcome
  from '../../../../client/javascript/pages/FullAssessmentOutcome';

xdescribe('<FullAssessmentOutcome', () => {
  it('render the page without errors', () => {
    mount(<FullAssessmentOutcome />);
  });
});

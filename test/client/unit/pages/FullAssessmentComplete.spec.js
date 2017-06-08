import React from 'react';
import { mount } from 'enzyme';

import FullAssessmentComplete
  from '../../../../client/javascript/pages/FullAssessmentComplete';

describe('<FullAssessmentComplete', () => {
  it('render the page without errors', () => {
    mount(<FullAssessmentComplete />);
  });
});

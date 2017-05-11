import React from 'react';
import { mount } from 'enzyme';

import store from '../src/javascript/store';
import routes from '../src/javascript/Router';

describe('App', () => {
  it('should render', () => {
    mount(routes(store));
  });
});

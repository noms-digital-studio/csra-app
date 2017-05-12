import React from 'react';
import { mount } from 'enzyme';

import store from '../../client/javascript/store';
import routes from '../../client/javascript/Router';

describe('App', () => {
  it('should render', () => {
    mount(routes(store));
  });
});

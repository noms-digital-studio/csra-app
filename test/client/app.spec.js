import { mount } from 'enzyme';

import { store, history } from '../../client/javascript/store';
import routes from '../../client/javascript/Router';

describe('App', () => {
  it('should render', () => {
    mount(routes({ history, store }));
  });
});

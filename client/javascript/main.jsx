import 'es5-shim';
import 'babel-polyfill';
import { render } from 'react-dom';

import './utils/debug';

import store from './store';
import routes from './Router';

render(routes(store), document.getElementById('mountNode'));

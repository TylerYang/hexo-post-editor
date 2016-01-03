import React from 'react';
import { render } from 'react-dom';
import { Router, Route} from 'react-router';
import {Posts, About, App} from './components';
import injectTapEventPlugin from 'react-tap-event-plugin';
require('./base.less');
injectTapEventPlugin();

render((
    <Router>
      <Route component={App}>
        <Route name="Posts" component={Posts} path="/" />
        <Route name="About" component={About} path="/about"/>
      </Route>
    </Router>
), document.getElementById('content'));

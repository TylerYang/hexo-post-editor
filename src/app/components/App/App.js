import React from 'react';
import { default as reactMixin } from 'react-mixin';
import { History } from 'react-router';
import { AppBar, Paper, Tabs, Tab, Styles} from 'material-ui/lib/';

import * as editorTheme from '../../settings/theme';
import * as _ from 'underscore';

const logoImg = require('./logo.svg');
const ThemeManager = Styles.ThemeManager;

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(editorTheme)
    };
  }
  render() {
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

reactMixin(App.prototype, History);
export default App;

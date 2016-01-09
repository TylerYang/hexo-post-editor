import React from 'react';
import { default as reactMixin } from 'react-mixin';
import { History } from 'react-router';
import { Styles } from 'material-ui/lib/';

import * as editorTheme from '../../settings/theme';
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
      <div style={{height: '100%'}}>
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

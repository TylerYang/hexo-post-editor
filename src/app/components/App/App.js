import React from 'react';
import { default as reactMixin } from 'react-mixin';
import { History } from 'react-router';
import { AppBar, Paper, Tabs, Tab, Styles} from 'material-ui/lib/';
import * as editorTheme from '../../settings/theme';
import { default as MediaQuery } from 'react-responsive/src';
import * as _ from 'underscore';

const logoImg = require('./logo.svg');
const ThemeManager = Styles.ThemeManager;

const appStyles = {
  header: {
    backgroundColor: editorTheme.palette.primary1Color,
    height: 64,
    position: 'fixed',
    width: '100%',
    top: 0
  },
  headerCtner: {
    maxWidth: 1200,
    padding: '0 20px',
    margin: '0 auto'
  },
  headerText: {
    display: 'inline-block',
    height: 64,
    lineHeight: '64px',
    color: 'white',
    fontSize: '21px',
    fontWeight: 100
  },
  logo: {
    width: 50,
    height: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 10
  },
  tabs: {
    float: 'right',
    width: 425
  },
  tab: {
    height: 64
  },
  ctner: {
    marginTop: 64
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    };
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(editorTheme)
    };
  }
  handleTabChange(value, e, tab) {
    this.props.history.pushState(null, value);
  }
  render() {
    const linkArr = [
      {label: 'POSTS', value: '/'},
      {label: 'ABOUT', value: '/about'}
    ];
    const linkList = linkArr.map((obj, idx) => {
      return (
        <Tab style={appStyles.tab} label={obj.label} value={obj.value}></Tab>
      );
    });

    const pathname = this.props.location.pathname;
    const initSelectedIdx = _.findIndex(linkArr, (linkObj) => {
      return linkObj.value === pathname;
    });

    const currLabel = (
      <span style={appStyles.headerText}>{linkArr[initSelectedIdx].label}</span>
    );

    return (
      <div>
        <Paper zDepth={0} style={appStyles.header}>
          <MediaQuery style={appStyles.headerCtner}
                query="(min-width: 701px)">
            <h1 style={appStyles.headerText}><img src={logoImg} style={appStyles.logo}/> Hexo Editor</h1>
            <Tabs value={this.props.location.pathname} initialSelectedIndex={initSelectedIdx} style={appStyles.tabs} onChange={this.handleTabChange.bind(this)}>
              {linkList}
            </Tabs>
          </MediaQuery>
          <MediaQuery style={appStyles.headerCtner} query="(max-width: 700px)">
            <AppBar title={currLabel} iconClassNameRight="muidocs-icon-navigation-expand-more" />
          </MediaQuery>
        </Paper>

        <div style={appStyles.ctner}>
            {this.props.children}
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

reactMixin(App.prototype, History);
export default App;

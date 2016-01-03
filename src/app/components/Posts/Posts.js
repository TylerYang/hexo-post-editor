import React from 'react';
import { default as fetch } from 'isomorphic-fetch';
import { default as SplitPane } from 'react-split-pane';
import { Snackbar } from 'material-ui/lib/';
import { default as PostLists } from './PostLists';
import { default as PostContent } from './PostContent';
import { default as _ } from 'underscore';
require('./splitPane.less');

const baseUrl = '/pl/v1/api';
const postsUrl = baseUrl + '/posts';
const postUrl = baseUrl + '/post';

const _msgObj = {
  'saving': {
    open: true,
    message: 'Saving Your Post...',
    action: 'Cancel',
    autoHideDuration: 3000
  },
  'saved': {
    open: true,
    message: 'Your Post Have Been Saved Successfully!',
    action: '',
    autoHideDuration: 800
  },
  'aborted': {
    open: true,
    message: 'Your Save Action Have Been Aborted.',
    action: 'OK',
    autoHideDuration: 3000
  },
  'close': {
    open: false,
    message: '',
    action: '',
    autoHideDuration: 100
  }
};

function getMsgByType(type) {
  return _msgObj[type];
}

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      selectedIndex: 1,
      snackType: 'close'
    };
  }
  componentDidMount() {
    fetch(postsUrl).then(
      (response) => response.json()
    ).then((response) => {
      if(response.succeed === true) {
        this.setState({
          posts: response.data
        });
      } else {
        //handle error here...
      }
    });
    this.lazySave = _.debounce(this.handleSave, 1000);
  }
  handleSelectItem(index) {
    this.setState({
      selectedIndex: index
    });
  }
  handleChange(content) {
    let post = this.getCurrPost();
    post._content = content;

    this.lazySave(post._id, content);
  }
  savePost(id, content) {
    fetch(postUrl + '/' + id, {
      method: 'post',
      body: JSON.stringify({
        _content: content
      })
    }).then(
      (response) => response.json()
    ).then((data) => {
      console.log(data);
      this.showSnackBar('saved');
    });
  }
  handleSave(content) {
    let post = this.getCurrPost();
    post._content = content;
    this.showSnackBar('saving');
    this.savePost(post._id, content);
  }
  showSnackBar(type) {
    this.setState({
      snackType: type
    });
  }
  handleRequestClose() {
    this.setState({
      snackType: 'close'
    });
  }
  handleActionTouchTap() {
    if(this.state.snackType === 'aborted') {
      this.setState({
        snackType: 'close'
      });
    } else {
      this.showSnackBar('aborted');
    }
  }
  getCurrPost() {
    return this.state.posts[this.state.selectedIndex - 1];
  }
  render() {
    let currPost = (<div></div>);
    if(this.state.posts.length > 0) {
      let post = this.getCurrPost();
      currPost = (
        <PostContent onChange={this.handleChange.bind(this)}
          _id={post._id}
          onSave={this.handleSave.bind(this)}
          _content={post._content} />
      );
    }

    let snackbar = (<div></div>);
    if(this.state.snackType.length > 0) {
       const msgObj = getMsgByType(this.state.snackType);
       snackbar = (
         <Snackbar open={msgObj.open} message={msgObj.message}
          action={msgObj.action}
          autoHideDuration={msgObj.autoHideDuration}
          onActionTouchTap={this.handleActionTouchTap.bind(this)}
          onRequestClose={this.handleRequestClose.bind(this)}/>
       );
    }
    return (
      <div className="post-ctner">
        <SplitPane split="vertical" minSize="150" defaultSize="300">
          <div>
            <PostLists selectedIndex={this.state.selectedIndex}
              handleSelectItem={this.handleSelectItem.bind(this)}
              posts={this.state.posts} />
          </div>
          {currPost}
        </SplitPane>
        {snackbar}
      </div>
    );
  }
}

export default Posts;

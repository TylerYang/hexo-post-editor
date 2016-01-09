import React from 'react';
import { Motion, spring } from 'react-motion';
import { default as fetch } from 'isomorphic-fetch';
import { Snackbar, FloatingActionButton} from 'material-ui/lib/';
import { default as PostLists } from './PostLists';
import { default as PostContent } from './PostContent';
import { serialize } from '../../helpers';
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
  'failed': {
    open: true,
    message: 'Failed To Save Your Post Due To Some Exceptions!',
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

const styles = {
  postCtner: {
    height: '100%',
    overflow: 'scroll'
  },
  listCtner: {
    display: 'inline-block',
    height: '100%'
  },
  contentCtner: {
    display: 'inline-block',
    position: 'absolute',
    height: '100%'
  },
  leftIcon: {
    position: 'fixed',
    top: '50%',
    marginTop: '-55px',
    left: '270px'
  },
  listBtnCtner: {
    textAlign: 'center'
  },
  rightBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: '-55px',
    marginLeft: '-19px'
  },
  listBtn: {
    marginTop: '10px',
    width: '100%'
  },
  listIcon: {
    color: 'white'
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
      showList: true,
      snackType: 'close',
      mode: 'view'
    };
  }
  componentDidMount() {
    fetch(postsUrl).then(
      (response) => response.json()
    ).then((response) => {
      if(response.succeed === true) {
        this.setState({
          posts: _.sortBy(response.data, 'updated').reverse()
        });
      } else {
        //handle error here...
      }
    });
    this.lazySave = _.debounce(this.handleSave, 5000);
  }
  handleSelectItem(index) {
    this.setState({
      selectedIndex: index
    });
  }
  handleChange(content) {
    //text change save is lazy, should pass id as parameter or will intro async bug.
    let post = this.getCurrPost();
    this.lazySave(post._id, content);
  }
  savePost(id, content) {
    fetch(postUrl + '/' + id, {
      method: 'put',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: serialize({
        _content: content
      })
    }).then(
      (response) => response.json()
    ).then((response) => {
      if(response.succeed === true) {
        this.setPost(response.data);
        this.showSnackBar('saved');
      } else {
        this.showSnackBar('failed');
      }
    });
  }
  handleSave(id, content) {
    if(content === undefined) {
      content = id;
      let post = this.getCurrPost();
      post._content = content;
      id = post._id;
    }
    this.showSnackBar('saving');
    this.savePost(id, content);
  }
  toggleList(e) {
    const mod = this.state.mode === 'view' ? 'edit': 'view';
    this.setState({
      mode: mod
    });
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
  setPost(post) {
    var idx = _.findIndex(this.state.posts, (obj) => {
        return post._id === obj._id;
    });
    var posts = this.state.posts;
    posts[idx] = post;
    this.setState({
      posts: _.sortBy(posts, 'updated').reverse(),
      selectedIndex: 1
    });
  }
  createPost(title) {
    fetch(postUrl, {
      method: 'post',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: serialize({
        title: title,
        _content: ' '
      })
    }).then(
      (response) => response.json()
    ).then((response) => {
      if(response.succeed === true) {
        let newPosts = response.data;
        this.setState({
          posts: _.sortBy(newPosts, 'updated').reverse(),
          selectedIndex: 1
        });
      }
    });
  }
  renderPostList(currPost, interStyle) {
    let postList = null;
    if(interStyle.x < 100) {
      postList = (
        <div style={styles.listBtnCtner}>
          <FloatingActionButton mini={true}
            onClick={this.toggleList.bind(this)} style={_.extend(styles.listIcon, styles.rightBtn)} iconClassName="fa fa-angle-right" />
        </div>
      );
    } else if(interStyle.x > 100) {
      const opa = interStyle.x / 300;
      postList = (
        <div style={{opacity: opa}}>
          <PostLists onCreateNewPost={this.createPost.bind(this)} show={this.state.showList} selectedIndex={this.state.selectedIndex}
            handleSelectItem={this.handleSelectItem.bind(this)}
            posts={this.state.posts}
            />
          <FloatingActionButton mini={true}
            onClick={this.toggleList.bind(this)} style={styles.leftIcon} iconClassName="fa fa-angle-left" />
        </div>
      );
    }
    return (
      <div>
        <div style={_.extend(styles.listCtner, {width: interStyle.x + 'px'})}>
          {postList}
        </div>
        <div style={_.extend(styles.contentCtner, {width: 'calc(100% - ' + interStyle.x + 'px)'})}>
          {currPost}
        </div>
      </div>
    );
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
      <div style={styles.postCtner} className='post-ctner'>
        <Motion style={{x: spring(this.state.mode === 'view' ? 50: 300)}}>
          {this.renderPostList.bind(this, currPost)}
        </Motion>
        {snackbar}
      </div>
    );
  }
}

export default Posts;

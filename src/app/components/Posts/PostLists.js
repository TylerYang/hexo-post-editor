import React from 'react';
import { Avatar, List, ListItem, FloatingActionButton, TextField} from 'material-ui/lib/';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
import * as editorTheme from '../../settings/theme';
import { Colors } from 'material-ui/lib/styles';

const SelectableList = SelectableContainerEnhance(List);

function trimMarkup(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

let styles = {
  listCtner: {

  },
  leftIcon: {
    position: 'fixed',
    top: '50%',
    marginTop: '-10px',
    left: '270px',
  },
  input: {
    marginLeft: 10,
    marginTop: 0,
  }
};

class PostLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: this.props.selectedIndex,
      show: this.props.show
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedIndex !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: nextProps.selectedIndex
      });
    }
  }
  handleUpdateSelectedIndex(e, index) {
    this.setState({
      selectedIndex: index
    });
    this.props.handleSelectItem(index);
  }
  createNewPost(e) {
    let title = e.target.value;
    if(title === undefined || title.length === 0) {
      return;
    }
    this.props.onCreateNewPost(title);
    e.target.value = '';
  }
  render() {
    const postList = this.props.posts.map((post, idx) => {
      const photo = post.photos.length > 0 ? (
        <Avatar src={post.photos[0]} />
      ) : (
        <Avatar color={'#FFFFFF'}
          backgroundColor={editorTheme.palette.accent1Color} >
          {post.title.charAt(0).toUpperCase()}
          </Avatar>
      );

      return (
        <ListItem value={idx + 1} leftAvatar={photo} primaryText={post.title}
          secondaryText={trimMarkup(post.content)} secondaryTextLines={1} />
      );
    });

    return (
      <div style={styles.listCtner}>
        <TextField onEnterKeyDown={this.createNewPost.bind(this)}
          underlineFocusStyle={{borderColor: Colors.amber900}}
          style={styles.input} hintText="Create New Post" />

        <SelectableList valueLink={{value: this.state.selectedIndex,
          requestChange: this.handleUpdateSelectedIndex.bind(this)}}>
          {postList}
        </SelectableList>

        <FloatingActionButton mini={true}
          onClick={this.props.onHide} style={styles.leftIcon} iconClassName="fa fa-angle-left" />
      </div>
    );
  }
}

export default PostLists;

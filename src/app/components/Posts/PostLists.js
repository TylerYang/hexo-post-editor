import React from 'react';
import { Avatar, List, ListItem, IconButton } from 'material-ui/lib/';
import { SelectableContainerEnhance } from 'material-ui/lib/hoc/selectable-enhance';
import * as editorTheme from '../../settings/theme';

const SelectableList = SelectableContainerEnhance(List);

function trimMarkup(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

let styles = {
  leftIcon: {
    position: 'absolute',
    top: '50%',
    right: 0,
    marginTop: '-10px'
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
  handleUpdateSelectedIndex(e, index) {
    this.setState({
      selectedIndex: index
    });
    this.props.handleSelectItem(index);
  }
  render() {
    const postList = this.props.posts.map((post, idx) => {
      const photo = post.photos.length > 0 ? (
        <Avatar src={post.photos[0]} />
      ) : (
        <Avatar color={editorTheme.palette.accent1Color}
          backgroundColor={editorTheme.palette.accent1Color} />
      );

      return (
        <ListItem value={idx + 1} leftAvatar={photo} primaryText={post.title}
          secondaryText={trimMarkup(post.content)} secondaryTextLines={2} />
      );
    });

    return (
      <div>
        <SelectableList valueLink={{value: this.state.selectedIndex,
          requestChange: this.handleUpdateSelectedIndex.bind(this)}}
          subheader="All Posts">
          {postList}
        </SelectableList>

        <IconButton onClick={this.props.onHide} style={styles.leftIcon} iconClassName="fa fa-angle-left" />
      </div>
    );
  }
}

export default PostLists;

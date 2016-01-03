import React from 'react';
import { default as SplitPane } from 'react-split-pane';
import { default as PostEditor } from './PostEditor';
import { parse as parseMarkdown} from 'marked';

require('./markdown.less');

var styles = {
  mdCtner: {
    padding: '0 10px'
  }
};
function createMarkup(str) {
   return { __html: str };
}

class PostContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _content: this.props._content,
      _id: this.props._id,
      editorWidth: undefined
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      _content: nextProps._content,
      _id: nextProps._id
    });
  }
  handleContentChange(newContent) {
    if(newContent === this.state._content) {
      return;
    }
    this.setState({
      _content: newContent
    });
     this.props.onChange(newContent);
  }
  handlePaneSizeChange(size) {
    this.setState({
      editorWidth: size
    });
  }
  render() {
    let contentHTML = createMarkup(parseMarkdown(this.state._content));
    return (
      <SplitPane split="vertical" onChange={this.handlePaneSizeChange.bind(this)}
        minSize="150">
        <PostEditor _content={this.state._content} width={this.state.editorWidth}
          onSave={this.props.onSave} _id={this.state._id}
          onChange={this.handleContentChange.bind(this)}/>
        <div className="markdown-body" style={styles.mdCtner}>
          <div dangerouslySetInnerHTML={contentHTML} />
        </div>
      </SplitPane>
    );
  }
}

export default PostContent;

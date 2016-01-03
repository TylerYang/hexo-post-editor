import React from 'react';
import { default as ReactDOM } from 'react-dom';
import { default as CodeMirror } from 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/keymap/vim';

require('./markdown.less');
require('./codemirror-fix.less');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let currNode = ReactDOM.findDOMNode(this);

    this.cm = CodeMirror(currNode, {
      value: this.props._content || '',
      theme: 'monokai',
      mode: 'markdown',
      keyMap: 'vim',
      lineWrapping: true
    });

    this.cm.on('change', (cm) => {
      this.props.onChange(cm.getValue());
    });

    this.cm.save = () => {
      this.props.onSave(this.cm.getValue())
    };

    this._resizeCodeMirror();
  }
  componentDidUpdate(prevProps) {
    if(prevProps._content !== this.props._content &&
       this.props._content !== this.cm.getValue()) {
      this.cm.setValue(this.props._content);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.width !== undefined) {
      this.cm.setSize('100%', '100%');
    }
  }
  _resizeCodeMirror() {
    if(this.cm !== undefined) {
      this.cm.setSize('100%', '100%');
    }
  }
  render() {
    return (
      <div/>
    );
  }
}

export default PostEditor;

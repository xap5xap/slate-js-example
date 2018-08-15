import React, { Component } from 'react';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';

import './App.css';

const existingValue = localStorage.getItem('content');
const initialValue = Plain.deserialize(existingValue || 'A string of plain text');

function MarkHotkey(options) {
  const { type, key } = options;

  return {
    onKeyDown(event, change) {
      if (!event.ctrlKey || event.key !== key) return;
      event.preventDefault();
      change.toggleMark(type);
      return true;
    }
  };
}

const plugins = [
  MarkHotkey({ type: 'bold', key: 'b' }),
  MarkHotkey({ type: 'code', key: '`' }),
  MarkHotkey({ type: 'italic', key: 'i' }),
  MarkHotkey({ type: 'strikethrough', key: '~' }),
  MarkHotkey({ type: 'underline', key: 'u' })
];

class App extends Component {
  state = {
    value: initialValue
  };

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      console.log('onChange - value.document', value.document);
      const content = Plain.serialize(value);
      console.log('onChange content', content);
      localStorage.setItem('content', content);
    }
    this.setState({ value });

  };

  renderMark = props => {
    switch (props.mark.type) {
      case 'bold':
        return <strong>{props.children}</strong>;
      case 'code':
        return <code>{props.children}</code>;
      case 'italic':
        return <em>{props.children}</em>;
      case 'strikethrough':
        return <del>{props.children}</del>;
      case 'underline':
        return <u>{props.children}</u>;
    }
  };

  render() {
    // console.log('render', this.state);
    return (
      <div className="App">
      
        <Editor
          plugins={plugins}
          value={this.state.value}
          onChange={this.onChange}
          renderMark={this.renderMark}
        />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import logo from './logo.svg';
import './App.css';

const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(
  existingValue || {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: 'A line of text in a paragraph'
                }
              ]
            }
          ]
        }
      ]
    }
  }
);

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
    if (value.document != this.state.value.document) {
      console.log('onChange - value.document', value.document);
      const content = JSON.stringify(value.toJSON());
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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

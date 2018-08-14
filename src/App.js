import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import logo from './logo.svg';
import './App.css';

const initialValue = Value.fromJSON({
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
});

function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
}

class App extends Component {
  state = {
    value: initialValue
  };

  onChange = ({ value }) => {
    console.log('onChange', value);
    this.setState({ value });
  };

  onKeyDown = (event, change) => {
    console.log('onKeyDown', event.key);
    if (event.key !== '&') return true;

    event.preventDefault();
    change.insertText('and');
    return true;
  };

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />;
    }
  };
  
  render() {
    console.log('render', this.state);
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
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}

export default App;

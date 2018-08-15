import React, { Component } from 'react';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';

import './App.css';

const BLOCK_TAGS = {
  p: 'paragraph',
  blockquote: 'quote',
  pre: 'code'
};

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline'
};

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'block',
          type: 'paragraph',
          data: {
            className: el.getAttribute('class')
          },
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>;
          case 'quote':
            return <blockquote>{children}</blockquote>;
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
        }
      }
    }
  },
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          case 'underline':
            return <u>{children}</u>;
        }
      }
    }
  }
];
const html = new Html({ rules });

const initialValue = localStorage.getItem('content') || '<p></p>';

class App extends Component {
  state = {
    value: html.deserialize(initialValue)
  };

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      const string = html.serialize(value);
      localStorage.setItem('content', string);
    }
    this.setState({ value });
  };

  renderNode = props => {
    switch (props.node.type) {
      case 'code':
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );

      case 'paragraph':
        return (
          <p {...props.attributes} className={props.node.data.get('className')}>
            {props.children}
          </p>
        );

      case 'quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
    }
  };

  renderMark = props => {
    const { mark, attributes, children } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;

      case 'italic':
        return <em {...attributes}>{children}</em>;

      case 'underline':
        return <u {...attributes}>{children}</u>;
    }
  };
  render() {
    // console.log('render', this.state);
    return (
      <div className="App">
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    );
  }
}

export default App;

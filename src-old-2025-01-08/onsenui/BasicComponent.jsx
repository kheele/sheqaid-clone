import React from 'react';
import ReactDOM from 'react-dom';

import elements from './elements';

class BasicComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.updateClasses = this.updateClasses.bind(this);
  }

  updateClasses() {
    const node = ReactDOM.findDOMNode(this);

    if (!node) {
      return;
    }

    if (typeof this.props.className !== 'undefined') {
      if (this.lastClass) {
        node.className = node.className.replace(this.lastClass, ' ');
      }

      this.lastClass = this.props.className.trim();

      node.className = node.className.trim() + ' ' + this.lastClass;
    }
  }

  componentDidMount() {
    this.updateClasses();
  }

  componentDidUpdate() {
    this.updateClasses();
  }
}

export default BasicComponent;

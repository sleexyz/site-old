import React, {createClass, createElement} from 'react';

module.exports = {
  createPure: (displayName, pureComponent) => {
    const Component = createClass({
      displayName,
      render() {
        return pureComponent(this.props);
      }
    });
  },
  WithProps: (props, component) => (defaultProps) => {
    return createElement(component, _.merge({}, defaultProps, props));
  }
};

import React, {createClass, createElement} from 'react';
import {lifecycle} from 'recompose';

module.exports = {
  setTitle: (mapPropsToTitle) => lifecycle({
    componentDidMount() {
      document.title = mapPropsToTitle(this.props);
    }
  })
};

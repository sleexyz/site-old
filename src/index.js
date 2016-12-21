import React, {createClass, createElement} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import {Router, browserHistory} from 'react-router';

import 'src/global.less';
import 'src/highlight.less';
import posts from 'src/posts';
import {WithProps} from 'src/hocs'
import App from 'src/app';
import Post from 'src/post';
import Landing from 'src/landing';


const routes = {
  path: '/',
  component: App,
  indexRoute: {component: Landing},
  childRoutes: _.map(_.toPairs(posts), ([key, post]) => ({
    path: `posts/${key}`,
    component: WithProps({post}, Post)
  }))
};

const Main = createClass({
  displayName: 'Main',
  render() {
    return (
      <Router history={browserHistory} routes={routes}/>
    );
  }
});

ReactDOM.render(<Main/>, document.getElementById('root'));

if (module.hot) {
  // accept all updates, rerender
  module.hot.accept(false, function() {
    const Next = require('./app');
    ReactDOM.render(<Next/>, document.getElementById('root'));
  });
}

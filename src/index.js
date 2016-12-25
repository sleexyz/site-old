import React, {createClass, createElement} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import {Router, browserHistory} from 'react-router';

import 'src/global.less';
import 'src/highlight.less';
import posts from 'src/posts';
import {withProps} from 'recompose';
import App from 'src/app';
import my_posts from 'src/post';
import Landing from 'src/landing';
import NotFound from 'src/not_found';

const postRoutes = _.map(_.toPairs(posts), ([key, post]) => ({
  path: `posts/${key}`,
  component: withProps({post})(my_posts)
}));

const routes = {
  path: '/',
  component: App,
  indexRoute: {component: Landing},
  childRoutes:  _.concat(postRoutes, {
    path: '*',
    component: NotFound
  })
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
  module.hot.accept(undefined, function() {
    const Next = require('./app');
    ReactDOM.render(<Next/>, document.getElementById('root'));
  });
}

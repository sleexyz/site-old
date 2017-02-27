// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import _ from 'lodash';
import { withProps } from 'app/hocs';
import posts from 'app/posts';
import App from 'app/components/App';
import Landing from 'app/pages/Landing';
import NotFound from 'app/pages/NotFound';
import Post from 'app/pages/Post';

const postRoutes = _.map(_.toPairs(posts), ([key, post]) => ({
  path: `posts/${key}`,
  component: withProps({ post })(Post),
}));

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Landing },
  childRoutes: _.concat(postRoutes, {
    path: '*',
    component: NotFound,
  }),
};

class Main extends Component {
  render() {
    return (
      <Router history={browserHistory} routes={routes} />
    );
  }
}

const renderApp = () => {
  ReactDOM.render(<Main />, document.getElementById('root'));
};

renderApp();

/* eslint global-require: 0, flowtype/no-weak-types: 0 */
if (module.hot) {
  (module: any).hot.accept(undefined, () => {
    renderApp();
  });
}

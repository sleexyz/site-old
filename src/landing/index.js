import React, {createClass} from 'react';
import {Link} from 'react-router';

const cn = require('classnames/bind').bind(require('./style.less'));
import posts from 'src/posts';

const Contents = createClass({
  render() {
    return (
      <div className={cn('contents')}>
        {_.map(_.toPairs(posts), this.renderLink)}
      </div>
    );
  },
  renderLink([key, post], i) {
    return (
      <div key={i}>
        <Link to={`/posts/${key}`}>
          {post.title}
        </Link>
      </div>
    )
  },
});

const Landing = createClass({
  render() {
    return (
      <div>
        <div className={cn('blur')}>
          hello world
        </div>
        <Contents/>
      </div>
    );
  },
});

module.exports = Landing;

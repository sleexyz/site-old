// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import dateFormat from 'date-fns/format';
import _ from 'lodash';
import cn from 'classnames/bind';

import rawPosts from 'app/posts';

class Contents extends Component {
  props: {
    showDrafts: boolean,
  }
  renderLink = ([key, post]: *, i: number) => {
    return (
      <div className={cn('post', { blur: post.draft })} key={i}>
        <span className={cn('post-date')}> {dateFormat(post.date, 'MMM DD, YYYY')} </span>
        <Link to={`/posts/${key}`} className={cn('post-title')}>
          {post.title}
        </Link>
      </div>
    );
  }
  render() {
    let posts = _.toPairs(rawPosts);
    if (!this.props.showDrafts) {
      posts = _.filter(posts, ([, value]) => value.draft);
    }
    posts = _.sortBy(posts, [([, value]) => value.date]);
    posts = posts.reverse();
    return (
      <div className={cn('contents')}>
        {_.map(posts, this.renderLink)}
      </div>
    );
  }
}

export default Contents;

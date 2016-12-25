import React, {createClass, PropTypes} from 'react';
import {Link} from 'react-router';
import dateFormat from 'date-fns/format'

import {apply} from 'src/utils'
import {setTitle} from 'src/hocs'

const cn = require('classnames/bind').bind(require('./style.less'));
import my_posts from 'src/posts';

const isNotFalse = (val) => val != null ? !val : true;

const Contents = createClass({
  propTypes: {
    showDrafts: PropTypes.bool.isRequired
  },
  render() {
    let posts = _.toPairs(my_posts);
    if (!this.props.showDrafts) {
      posts = _.filter(posts, ([key, value]) => isNotFalse(value.draft));
    }
    posts = _.sortBy(posts, [([key, value]) => value.date]);
    posts = posts.reverse();
    return (
      <div className={cn('contents')}>
      {_.map(posts, this.renderLink)}
      </div>
    );
  },
  renderLink([key, post], i) {
    return (
      <div className={cn('post', {blur: !isNotFalse(post.draft)})} key={i}>
        <span className={cn('post-date')}> {dateFormat(post.date, 'MMM DD, YYYY')} </span>
        <Link to={`/posts/${key}`} className={cn('post-title')}>
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
        <div className={cn('description')}>
          morphism plumber
        </div>
        <div className={cn('socials')}>
          <a href={'https://github.com/sleexyz'}>
            <div className={cn('github')}/>
          </a>
          <a href={'https://twitter.com/sleexyz'}>
            <div className={cn('twitter')}/>
          </a>
        </div>
        <Contents showDrafts={this.props.router.location.query.showDrafts === 'true'}/>
      </div>
    );
  },
});

module.exports = apply(
  Landing,
  setTitle(() => 'sean lee')
);

import React, {createClass, createElement} from 'react';
const cn = (require('classnames/bind')).bind(require('./style.less'));
import {Link} from 'react-router';
import dateFormat from 'date-fns/format'

import {apply} from 'src/utils'
import {setTitle} from 'src/hocs'

const Post = (({post}) => {
  const postBody = {
    __html: post.body
  };
  return (
    <div>
      <h1 className={cn('title')}>{post.title}</h1>
      <div className={cn('date')}>{dateFormat(post.date, 'MMM DD, YYYY')}</div>
      <div className={cn('content')} dangerouslySetInnerHTML={postBody}>
      </div>
    </div>
  );
});
module.exports = apply(
  Post,
  setTitle((props) => props.post.title)
);

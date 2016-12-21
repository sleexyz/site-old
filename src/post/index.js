import React, {createClass, createElement} from 'react';
import {Link} from 'react-router';

const cn = (require('classnames/bind')).bind(require('./style.less'));
import posts from 'src/posts';

const Post = ({post}) => {
  const postBody = {
    __html: post.body
  };
  return (
    <div>
      <div className={cn('body')} dangerouslySetInnerHTML={postBody}>
      </div>
    </div>
  );
};

module.exports = Post;

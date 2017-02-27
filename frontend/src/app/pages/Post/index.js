import React from 'react';
import cn from 'classnames/bind';
import dateFormat from 'date-fns/format';
import { setTitle } from 'app/hocs';

const Post = (({ post }: *) => {
  const postBody = {
    __html: post.body,
  };
  return (
    <div>
      <h1 className={cn('title')}>{post.title}</h1>
      <div className={cn('date')}>{dateFormat(post.date, 'MMM DD, YYYY')}</div>
      <div className={cn('content')} dangerouslySetInnerHTML={postBody} />
    </div>
  );
});

export default setTitle((props) => props.post.title)(Post);

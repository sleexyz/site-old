// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import dateFormat from 'date-fns/format';
import _ from 'lodash';
import styled from 'styled-components';
import * as styles from 'app/styles';
import rawPosts from 'app/posts';

const PostLink = styled.div`
margin: 0.1em 0;
display: flex;
flex-direction: row;
align-items: flex-start;
${props => (props.isDraft ? 'filter: blur(1px)' : '')}
`;

const PostDate = styled.span`
${styles.textLabel()}
`;

const PostTitle = styled.span`
text-decoration: none;
color: inherit;
&:visited {
  color: inherit;
}
`;

const ContentContainer = styled.div`
margin: 4em 0;
`;

const Entry = (props: { id: string, post: * }) => {
  const { id, post } = props;
  return (
    <PostLink isDraft={post.draft}>
      <PostDate>
        {dateFormat(post.date, 'MMM DD, YYYY')}
      </PostDate>
      <Link to={`/posts/${id}`}>
        <PostTitle>
          {post.title}
        </PostTitle>
      </Link>
    </PostLink>
  );
};

class Contents extends Component {
  props: {
    showDrafts: boolean,
  }
  // TODO: deprecate lodash
  normalizePosts = (posts: *) => {
    const { showDrafts } = this.props;
    let postPairs = _.toPairs(posts);
    if (!showDrafts) {
      postPairs = _.filter(postPairs, ([, value]) => !value.draft);
    }
    postPairs = _.sortBy(postPairs, [([, value]) => value.date]);
    postPairs = postPairs.reverse();
    return postPairs;
  }
  render() {
    const postPairs = this.normalizePosts(rawPosts);
    return (
      <ContentContainer>
        {postPairs.map(([id, post]) => <Entry id={id} post={post} key={id} />)}
      </ContentContainer>
    );
  }
}

export default Contents;

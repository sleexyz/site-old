// @flow
import React, { Component } from 'react';
import dateFormat from 'date-fns/format';
import styled from 'styled-components';
import { setTitle } from 'app/hocs';
import * as styles from 'app/styles';

const Title = styled.h1`
margin: 2em 0;
`;

const Content = styled.div `
margin: 2em 0;
`;

const Date = styled.div`
${styles.textLabel()}
`;

class Post extends Component {
  props: {
    post: *
  }
  componentDidMount() {
    window.MathJax.Hub.Typeset();
  }
  render() {
    const { post } = this.props;
    return (
      <div>
        <Title>{post.title}</Title>
        <Date>{dateFormat(post.date, 'MMM DD, YYYY')}</Date>
        <Content dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    );
  }
}

export default setTitle((props) => props.post.title)(Post);

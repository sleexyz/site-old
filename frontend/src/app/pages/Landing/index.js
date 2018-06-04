// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { setTitle } from 'app/hocs';
import githubIcon from 'app/images/github.png';
import twitterIcon from 'app/images/twitter.png';
import Contents from './Contents';

class Landing extends Component {
  props: {
    router: *
  }
  render() {
    return (
      <div>
        <Description>
          syntqx plumber
        </Description>
        <Socials>
          <Link href={'https://github.com/sleexyz'}>
            github
          </Link>
          <Link href={'https://instagram.com/syntqxyz'}>
            instagram
          </Link>
          <Link href={'https://twitter.com/syntqxyz'}>
            twitter
          </Link>
        </Socials>
        <Contents showDrafts={this.props.router.location.query.showDrafts === 'true'} />
      </div>
    );
  }
}

export default setTitle(() => 'sean lee')(Landing);

const Description = styled.div`
margin: 4em 0;
color: white;
`;

const Socials = styled.div`
margin: 4em 0;
`;

const Link = styled.a`
  display: block;
  color: white;
  &:visited {
    color: white;
  }
  padding-top: 10px;
`;

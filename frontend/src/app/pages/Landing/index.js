// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { setTitle } from 'app/hocs';
import githubIcon from 'app/images/github.png';
import twitterIcon from 'app/images/twitter.png';
import Contents from './Contents';

const Description = styled.div`
margin: 4em 0;
`;

const Socials = styled.div`
margin: 4em 0;
`;

const Icon = styled.div`
filter: blur(10px);
background-size: @icon;
background-image: url("${props => props.path}");
background-repeat: no-repeat;
width: 2em;
height: 2em;
margin: 2em 0;
`;

class Landing extends Component {
  props: {
    router: *
  }
  render() {
    return (
      <div>
        <Description>
          morphism plumber
        </Description>
        <Socials>
          <a href={'https://github.com/sleexyz'}>
            <Icon path={githubIcon} />
          </a>
          <a href={'https://twitter.com/sleexyz'}>
            <Icon path={twitterIcon} />
          </a>
        </Socials>
        <Contents showDrafts={this.props.router.location.query.showDrafts === 'true'} />
      </div>
    );
  }
}

export default setTitle(() => 'sean lee')(Landing);

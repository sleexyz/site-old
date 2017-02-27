import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const AppOuter = styled.div`
display: flex;
justify-content: center;
`;

const AppInner = styled.div`
margin: 6em 4em;
width: 37.5em;
`;

const Content = styled.div`
margin-top: 4em;
`;

const Name = styled.div`
filter: blur(8px);
text-decoration: none;
color: inherit;
&:visited {
  color: inherit;
}
`;

const Header = () => {
  return (
    <Link to={'/'}>
      <Name>
        sean lee
      </Name>
    </Link>
  );
};

const App = (props: *) => {
  return (
    <AppOuter>
      <AppInner>
        <Header />
        <Content>
          {props.children}
        </Content>
      </AppInner>
    </AppOuter>
  );
};

module.exports = App;

// @flow
import React, { Component } from 'react';
import cn from 'classnames/bind';
import { setTitle } from 'app/hocs';
import Contents from './Contents';

class Landing extends Component {
  props: {
    router: *
  }
  render() {
    return (
      <div>
        <div className={cn('description')}>
          morphism plumber
        </div>
        <div className={cn('socials')}>
          <a href={'https://github.com/sleexyz'}>
            <div className={cn('github')} />
          </a>
          <a href={'https://twitter.com/sleexyz'}>
            <div className={cn('twitter')} />
          </a>
        </div>
        <Contents showDrafts={this.props.router.location.query.showDrafts === 'true'} />
      </div>
    );
  }
}

export default setTitle(() => 'sean lee')(Landing);

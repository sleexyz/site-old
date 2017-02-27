import React from 'react';
import { Link } from 'react-router';

const cn = require('classnames/bind').bind(require('./style.less'));

const Header = () => {
  return (
    <Link to={'/'} className={cn('name')}>
        sean lee
    </Link>
  );
};

const App = (props: *) => {
  return (
    <div className={cn('app-container')}>
      <div className={cn('app')}>
        <Header />
        <div className={cn('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

module.exports = App;

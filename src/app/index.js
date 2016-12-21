import React from 'react';
import {createPure} from 'src/hocs';

const cn = require('classnames/bind').bind(require('./style.less'));

const App = createPure('App', (props) => {
  return (
    <div className={cn('app')}>
      {props.children}
    </div>
  );
});

module.exports = App;

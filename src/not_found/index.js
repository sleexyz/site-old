const cn = require('classnames/bind').bind(require('./style.less'));
import React from 'react';

import {apply} from 'src/utils';
import {setTitle} from 'src/hocs';

const NotFound = () => <div>Not Found!</div>

module.exports = apply(
  NotFound,
  setTitle(() => 'not found!')
);

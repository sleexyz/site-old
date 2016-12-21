import _ from 'lodash';
import path from 'path';

const requireObj = (context) =>
  _.fromPairs(_.map(context.keys(), ((key) => [
    path.basename(key).split('.')[0],
    context(key)
  ])));
module.exports = requireObj(require.context('../posts', true, /md$/));

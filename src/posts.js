import _ from 'lodash';
import path from 'path';

const requireAllAsObj = (requireContext) =>
  _.fromPairs(_.map(requireContext.keys(), ((key) => [
    path.basename(key).split('.')[0],
    requireContext(key)
  ])));
module.exports = requireAllAsObj(require.context('../posts', true, /md$/));

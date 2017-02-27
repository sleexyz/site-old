// @flow
import { lifecycle } from 'recompose';

export const setTitle = (mapPropsToTitle: * => string) => {
  return lifecycle({
    componentDidMount() {
      document.title = mapPropsToTitle(this.props);
    },
  });
};

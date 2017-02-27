// @flow
import * as Recompose from 'recompose';

export const withProps = Recompose.withProps;

export const setTitle = <A>(mapPropsToTitle: * => string): A => {
  return Recompose.lifecycle({
    componentDidMount() {
      document.title = mapPropsToTitle(this.props);
    },
  });
};

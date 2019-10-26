import * as React from 'react';
// @ts-ignore
import minimalTemp from './handlebars/minimal.hbs';

interface IProps {
  autoSavedData: any;
}
interface IState {}

class MinimalTemplate extends React.Component<IProps, IState> {
  render() {
    const { autoSavedData } = this.props;

    return (
      <div dangerouslySetInnerHTML={{ __html: minimalTemp(autoSavedData) }} />
    );
  }
}

export default MinimalTemplate;

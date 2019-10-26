import * as React from 'react';
// @ts-ignore
import classicTemp from './handlebars/classic.hbs';

interface IProps {
  autoSavedData: any;
}
interface IState {}

class ClassicTemplate extends React.Component<IProps, IState> {
  render() {
    const { autoSavedData } = this.props;

    return (
      <div dangerouslySetInnerHTML={{ __html: classicTemp(autoSavedData) }} />
    );
  }
}

export default ClassicTemplate;

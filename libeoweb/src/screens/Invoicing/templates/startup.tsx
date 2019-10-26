import * as React from 'react';
// @ts-ignore
import startupTemp from './handlebars/startup.hbs';

interface IProps {
  autoSavedData: any;
}
interface IState {}

class StartupTemplate extends React.Component<IProps, IState> {
  private template: any;

  render() {
    const { autoSavedData } = this.props;

    return (
      <div dangerouslySetInnerHTML={{ __html: startupTemp(autoSavedData) }} />
    );
  }
}

export default StartupTemplate;

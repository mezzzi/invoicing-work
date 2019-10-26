import * as React from 'react';
import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';
import ClassicTemplate from 'screens/Invoicing/templates/classic';
import MinimalTemplate from 'screens/Invoicing/templates/minimal';
import StartupTemplate from 'screens/Invoicing/templates/startup';
import 'screens/Invoicing/utils/handlebarHelpers';

interface IProps extends AutoSave.InjectedProps {
  templateId: number;
}

interface IState {}

class TemplateRenderer extends React.Component<IProps, IState> {
  render() {
    const { templateId, getAutoSavedData } = this.props;
    return (() => {
      switch (templateId) {
        case 1:
          return <MinimalTemplate autoSavedData={getAutoSavedData()} />;
          break;
        case 2:
          return <ClassicTemplate autoSavedData={getAutoSavedData()} />;
          break;
        case 3:
          return <StartupTemplate autoSavedData={getAutoSavedData()} />;
          break;
      }
    })();
  }
}

export default AutoSave.hoc()(TemplateRenderer);

import { IAutoSaveInterface } from 'components/Invoicing/types';
import { Consumer } from 'screens/Invoicing/contexts/AutoSave/context';
import hoc from 'screens/Invoicing/contexts/AutoSave/hoc';
import Provider from 'screens/Invoicing/contexts/AutoSave/provider';

export interface InjectedProps extends IAutoSaveInterface {}

export { Provider, Consumer, hoc };

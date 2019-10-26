import { Consumer, IContactsContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IContactsContextInterface {}

export { Provider, Consumer, hoc };

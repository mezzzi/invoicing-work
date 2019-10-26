import { Consumer, IAccountingContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IAccountingContextInterface {}

export { Provider, Consumer, hoc };

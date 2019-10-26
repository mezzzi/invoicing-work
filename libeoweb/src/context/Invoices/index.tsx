import { Consumer, IInvoicesContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IInvoicesContextInterface {}

export { Provider, Consumer, hoc };

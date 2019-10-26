import { Consumer, IInvoiceContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IInvoiceContextInterface {}

export { Provider, Consumer, hoc };

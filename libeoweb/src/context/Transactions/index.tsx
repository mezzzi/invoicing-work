import { Consumer, ITransactionsContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends ITransactionsContextInterface {}

export { Provider, Consumer, hoc };

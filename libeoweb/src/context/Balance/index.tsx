import { Consumer, IBalanceContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IBalanceContextInterface {}

export { Provider, Consumer, hoc };

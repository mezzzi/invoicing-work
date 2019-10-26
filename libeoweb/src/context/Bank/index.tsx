import { Consumer, IBanksContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IBanksContextInterface {}

export { Provider, Consumer, hoc };

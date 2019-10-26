import { Consumer, ISirenContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends ISirenContextInterface {}

export { Provider, Consumer, hoc };

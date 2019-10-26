import { Consumer, IIbanContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IIbanContextInterface {}

export { Provider, Consumer, hoc };

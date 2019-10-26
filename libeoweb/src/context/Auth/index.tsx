import { Consumer, IAuthContextInterface, IAuthInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IAuthContextInterface {}
export interface InjectedInterface extends IAuthInterface {}

export { Provider, Consumer, hoc };

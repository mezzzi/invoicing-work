import { Consumer, IUserContextInterface, IUserInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IUserContextInterface {}
export interface InjectedInterface extends IUserInterface {}

export { Provider, Consumer, hoc };

import { Consumer, IPartnersContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IPartnersContextInterface {}

export { Provider, Consumer, hoc };

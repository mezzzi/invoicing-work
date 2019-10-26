import { Consumer, IAddressesContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IAddressesContextInterface {}

export { Provider, Consumer, hoc };

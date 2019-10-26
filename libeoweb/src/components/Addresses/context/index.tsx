import { Consumer, IEditAddressesContext, Provider } from './context';
import hoc from './hoc';

export interface InjectedProps extends IEditAddressesContext {}

export { Provider, Consumer, hoc };

import { Consumer, IPartnerContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IPartnerContextInterface {}

export { Provider, Consumer, hoc };

import { Consumer, IKycContext, Provider } from './context';
import hoc from './hoc';

export interface InjectedProps extends IKycContext {}

export { Provider, Consumer, hoc };

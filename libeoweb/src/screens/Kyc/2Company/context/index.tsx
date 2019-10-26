import { Consumer, ITempCompanyContext, Provider } from './context';
import hoc from './hoc';

export interface InjectedProps extends ITempCompanyContext {}

export { Provider, Consumer, hoc };

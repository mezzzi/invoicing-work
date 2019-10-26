import { Consumer, IEditContactContext, Provider } from './context';
import hoc from './hoc';

export interface InjectedProps extends IEditContactContext {}

export { Provider, Consumer, hoc };

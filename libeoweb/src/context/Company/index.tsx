import { Consumer, ICompanyContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends ICompanyContextInterface {}

export { Provider, Consumer, hoc };

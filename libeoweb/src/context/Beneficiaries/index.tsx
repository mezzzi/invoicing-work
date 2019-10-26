import { Consumer, IBeneficiariesContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IBeneficiariesContextInterface {}

export { Provider, Consumer, hoc };

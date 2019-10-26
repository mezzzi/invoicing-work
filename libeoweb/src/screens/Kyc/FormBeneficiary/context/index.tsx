import { Consumer, ITempBeneficiaryContext, Provider } from './context';
import hoc from './hoc';

export interface InjectedProps extends ITempBeneficiaryContext {}

export { Provider, Consumer, hoc };

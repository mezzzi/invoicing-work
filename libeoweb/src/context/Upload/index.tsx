import { Consumer, IUploadContextInterface } from './context';
import hoc from './hoc';
import Provider from './provider';

export interface InjectedProps extends IUploadContextInterface {}

export { Provider, Consumer, hoc };

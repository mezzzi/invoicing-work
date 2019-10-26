import * as Upload from 'context/Upload';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './Styles.module.less';

import PurcharseControl from './Control';
interface IProps extends RouteComponentProps {}

class Invoice extends React.PureComponent<IProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const {
      match: { params },
    }: any = this.props;

    return <PurcharseControl id={params.id} />;
  }
}

export default Upload.hoc()(Invoice);

import { Content } from 'components/Layout';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps {}

interface IState {}

class Company extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    return <Content />;
  }
}

export default Company;

import { Col } from 'antd';
import * as React from 'react';

interface IProps {
  img: any;
  gradient?: boolean;
}

interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    const { img } = this.props;

    return (
      <Col
        className="desktop-only"
        sm={10}
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div className="img-login">{img}</div>
        <div className="Background" />
      </Col>
    );
  }
}

export default Wrapper;

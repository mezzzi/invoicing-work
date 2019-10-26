import { Col, Row } from 'antd';
import { H1 } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { HeroImg } from '.';

interface IProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  img: any;
}

interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    const { children, title, className, img } = this.props;

    return (
      <Row
        className={className}
        type="flex"
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <HeroImg img={img} />
        <Col xs={24} sm={12} offset={2}>
          <Row className="sign-wrapper" type="flex" align="middle">
            <Col span={24}>
              <H1 css={{ primaryColor: true }}>
                <FormattedMessage id={title} />
              </H1>
              {children}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Wrapper;

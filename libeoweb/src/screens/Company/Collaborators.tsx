import { Avatar, Col, Row } from 'antd';
import { IconValue } from 'components/Assets/Icon';
import { Card, CardRow } from 'components/Card';
import { Content } from 'components/Layout';
import { Heading } from 'components/Typo';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import './Collaborators.module.less';

interface IProps extends RouteComponentProps, User.InjectedProps {}

interface IState {}

class Collaborators extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { user } = this.props;
    const me: IUser = user && user.data && user.data.me;
    const currentCompany: ICompany = me && me.currentCompany;

    return (
      <Content>
        <Row type="flex">
          <Heading
            icon={IconValue.UserGroup}
            title={'collaborators.header.title'}
            description={'collaborators.header.description'}
          />
        </Row>
        <Row className="me" type="flex">
          <Col>
            {me && (
              <Avatar size="large" className="my-avatar">{`${me.firstname &&
                me.firstname.substring(0, 1)}${me.lastname &&
                me.lastname.substring(0, 1)}`}</Avatar>
            )}
          </Col>
          <div className="my-name">
            {me && `${me.firstname} ${me.lastname}`}
          </div>
        </Row>
        {currentCompany &&
          currentCompany.contacts &&
          currentCompany.contacts.rows &&
          currentCompany.contacts.rows.map((contact, i) => (
            <Col
              style={{ minWidth: '200px', marginBottom: '28px' }}
              key={`${i}`}
              span={8}
            >
              <Card
                shadow
                avatar={`${contact.firstname &&
                  contact.firstname.substring(0, 1)}${contact.lastname &&
                  contact.lastname.substring(0, 1)}`}
                title={`${contact.firstname ? `${contact.firstname} ` : ''}${
                  contact.lastname ? `${contact.lastname} ` : ''
                }`}
              >
                {contact.emails &&
                  contact.emails &&
                  contact.emails &&
                  contact.emails.rows &&
                  contact.emails.rows.length > 0 && (
                    <CardRow
                      title={
                        <FormattedMessage id="collaborators.contacts.email" />
                      }
                      rows={contact.emails.rows.map(row => row.email)}
                    />
                  )}
              </Card>
            </Col>
          ))}
      </Content>
    );
  }
}

export default User.hoc()(Collaborators);

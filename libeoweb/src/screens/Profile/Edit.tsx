import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Text } from 'components/Form';
import { Content, FloatingActionFooter } from 'components/Layout';
import { Heading } from 'components/Typo';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { errorOrSuccess, parseError } from 'utils';
import './Edit.module.less';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps,
    Alert.InjectedProps {}

interface IState {
  passwordValue: string | null;
}

class ProfileEdit extends React.PureComponent<IProps, IState> {
  state = {
    passwordValue: null,
  };

  passwordRef: HTMLInputElement | null = null;
  handleChangePassword: ((node: React.ChangeEvent) => void) | undefined;
  handleSetPasswordRef: ((node: HTMLInputElement) => void) | undefined;
  handleSave: () => void;
  constructor(props: any) {
    super(props);

    this.handleChangePassword = this.changePassword.bind(this);
    this.handleSetPasswordRef = this.setPasswordRef.bind(this);
    this.handleSave = this.save.bind(this);
  }

  save() {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const user = this.props.user;

        delete values['validate-password'];
        delete values.email;
        if (values.password === null) {
          delete values.password;
        }
        if (user && user.updateUser) {
          const { data, error } = await user.updateUser({
            variables: {
              input: values,
            },
          });
          errorOrSuccess(this.props.alert, parseError(error), [
            'profile.informations.save_success',
          ]);
        }
      }
    });
  }

  setPasswordRef(node: HTMLInputElement) {
    this.passwordRef = node;
  }

  changePassword() {
    this.setState({
      passwordValue: this.passwordRef && this.passwordRef.value,
    });
  }

  render() {
    const { user, intl, form } = this.props;
    const { passwordValue } = this.state;
    const me: IUser = user && user.data && user.data.me;

    return (
      <Content
        footer={
          <FloatingActionFooter visible={true}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={this.handleSave}
                style={{ marginRight: 50 }}
                type={BtnType.Primary}
                className="btn-control-save"
              >
                <FormattedMessage id="profile.informations.save_btn" />
              </Button>
            </div>
          </FloatingActionFooter>
        }
      >
        <Row type="flex">
          <Heading
            icon={IconValue.Graduation}
            title={'profile.header.title'}
            description={'profile.header.description'}
          />
        </Row>
        <Row gutter={90} type="flex">
          {me && (
            <Col span={12}>
              <Text
                defaultValue={me.firstname}
                id="firstname"
                label={<FormattedMessage id="profile.informations.firstname" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'profile.informations.firstname_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
              <Text
                defaultValue={me.lastname}
                id="lastname"
                label={<FormattedMessage id="profile.informations.lastname" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'profile.informations.lastname_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
              <Text
                defaultValue={me.email}
                id="email"
                disabled
                label={<FormattedMessage id="profile.informations.email" />}
                form={form}
              />
              {/* <Password
                label={<FormattedMessage id="signup.form.password" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'signup.form.password_strong_error'
                    }),
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\“\#\$\%\&\‘\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~])(?=.{8,})/,
                    required: false
                  }
                ]}
                inputRef={this.handleSetPasswordRef}
                onChange={this.handleChangePassword}
                form={form}
                hint={intl.formatMessage({
                  id: 'signup.form.password_hint'
                })}
              />
              <Password
                label={<FormattedMessage id="signup.form.comfirm_password" />}
                form={form}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'signup.form.comfirm_password_error'
                    }),
                    pattern: new RegExp(`^${escapeRegExp(passwordValue)}$`),
                    required: passwordValue ? true : false
                  }
                ]}
                id="validate-password"
              /> */}
            </Col>
          )}
        </Row>
      </Content>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  User.hoc(),
  Alert.hoc(),
)(ProfileEdit);

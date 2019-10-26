import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Text } from 'components/Form';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import './Iban.module.less';

interface IProps extends User.InjectedProps, FormComponentProps {}
interface IState {
  copied: boolean;
}

class Iban extends React.PureComponent<IProps, IState> {
  state = {
    copied: false,
  };

  copy = () => {
    const inputIban: any = document.querySelector('#iban');
    inputIban.removeAttribute('disabled');
    inputIban.select();
    document.execCommand('copy');
    this.setState({ copied: true });
    (window as any).getSelection().removeAllRanges();
    inputIban.blur();
    inputIban.setAttribute('disabled', true);

    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    const { copied } = this.state;
    const { user } = this.props;
    const currentCompany: ICompany =
      user && user.data && user.data.me && user.data.me.currentCompany;

    return (
      <Text
        className="iban-input"
        suffix={
          <div
            onClick={this.copy}
            className={`copy-btn${copied ? ' copied' : ''}`}
          >
            <FormattedMessage id="common.transfer.copy_btn" />
            <Icon value={IconValue.Checkmark} color="white" />
          </div>
        }
        disabled
        defaultValue={
          currentCompany &&
          (`${currentCompany.treezorIban}`.match(/.{1,4}/g) || []).join(' ')
        }
        form={this.props.form}
        label={<FormattedMessage id="common.transfer.iban" />}
        id="iban"
      />
    );
  }
}

export default compose(
  Form.create({}),
  User.hoc(),
)(Iban);

import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { Content } from 'components/Layout';
import { Heading } from 'components/Typo';
import * as BankCtx from 'context/Bank';
import { IBankAccount } from 'context/Bank/types';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import history from 'store/history';
import { isIban } from 'utils/common';
import BankForm from './components/BankForm';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps {}

const BankAdd: React.FunctionComponent<IProps> = ({
  user,
  intl,
  form,
  match,
}) => {
  const id = match && match.params && (match.params as any).id;
  const me: IUser = user && user.data && user.data.me;
  const currentCompany: ICompany = me && me.currentCompany;

  const close = () => {
    history.push('/company/bank');
  };

  return (
    <Content>
      <Row type="flex">
        <Heading
          icon={IconValue.Wallet}
          title={'bank.header.title'}
          description={'bank.header.description'}
        />
      </Row>
      {currentCompany && (
        <BankCtx.Provider id={id}>
          <BankCtx.Consumer>
            {({ bank }) => {
              const createOrUpdate = bank && bank.createOrUpdate;

              const submit = async (e?: React.FormEvent) => {
                e && e.preventDefault();
                form.validateFields(async (err: any, values: any) => {
                  if (!id && !isIban(values.iban)) {
                    form.setFields({
                      iban: {
                        errors: [
                          new Error(
                            intl.formatMessage({
                              id: 'common.control.iban_error',
                            }),
                          ),
                        ],
                        value: values.iban,
                      },
                    });
                    return;
                  }

                  if (!err) {
                    if (createOrUpdate) {
                      let newBankAccount: IBankAccount | null;
                      if (id) {
                        newBankAccount = await createOrUpdate(
                          { label: values.label },
                          id,
                        );
                      } else {
                        newBankAccount = await createOrUpdate({
                          iban: values.iban,
                          label: values.label,
                        });
                      }

                      if (
                        (newBankAccount && !newBankAccount.mandates) ||
                        (newBankAccount && newBankAccount.mandates.length === 0)
                      ) {
                        history.push(
                          `/company/bank/mandate/add/${newBankAccount.id}?bank`,
                        );
                      } else {
                        history.push('/company/bank');
                      }
                    }
                  }
                });
              };

              const bankAccount =
                bank && bank.bankAccount && bank.bankAccount.bankAccount;

              return (bankAccount && id) || !id ? (
                <BankForm
                  form={form}
                  onSubmit={submit}
                  onClose={close}
                  bank={
                    bank && bank.bankAccount && bank.bankAccount.bankAccount
                  }
                />
              ) : null;
            }}
          </BankCtx.Consumer>
        </BankCtx.Provider>
      )}
    </Content>
  );
};

export default compose(
  injectIntl,
  Form.create({}),
  User.hoc(),
)(BankAdd);

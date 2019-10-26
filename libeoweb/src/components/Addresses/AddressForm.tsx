import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Submit, Text } from 'components/Form';
import * as Addresses from 'context/Addresses';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import * as Context from './context';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    Addresses.InjectedProps,
    Context.InjectedProps {
  companyId: string;
  onUpdate?: () => void;
}

interface IState {}

class AddressForm extends React.PureComponent<IProps, IState> {
  state = {};

  handleSubmit: (e: React.FormEvent) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
  }

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editAddress, companyId, address, onUpdate } = this.props;
        const create = address && address.create;
        const id =
          editAddress &&
          editAddress.selectedAddress &&
          editAddress.selectedAddress.id;

        values.zipcode = parseInt(values.zipcode, 10);

        const updated = {
          ...values,
          companyId,
          id,
        };

        if (create) {
          await create(updated);
        }
        editAddress && editAddress.done();
        onUpdate && onUpdate();
      }
    });
  };

  render() {
    const { form, intl, editAddress } = this.props;
    const defaultValues = editAddress && editAddress.selectedAddress;

    return (
      <Addresses.Provider>
        <Addresses.Consumer>
          {({ address }) => {
            return (
              <Form className="form-address" onSubmit={this.handleSubmit}>
                <Text
                  id="address1"
                  defaultValue={defaultValues && defaultValues.address1}
                  label={<FormattedMessage id="addresses.form.address1" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'addresses.form.address1_error',
                      }),
                      required: false,
                    },
                  ]}
                  form={form}
                />
                <Text
                  id="address2"
                  defaultValue={defaultValues && defaultValues.address2}
                  label={<FormattedMessage id="addresses.form.address2" />}
                  form={form}
                />
                <Text
                  id="zipcode"
                  defaultValue={defaultValues && defaultValues.zipcode}
                  label={<FormattedMessage id="addresses.form.zipcode" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'addresses.form.zipcode_error',
                      }),
                      required: false,
                    },
                  ]}
                  form={form}
                />
                <Text
                  id="city"
                  defaultValue={defaultValues && defaultValues.city}
                  label={<FormattedMessage id="addresses.form.city" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'addresses.form.city_error',
                      }),
                      required: false,
                    },
                  ]}
                  form={form}
                />
                <Text
                  id="country"
                  defaultValue={defaultValues && defaultValues.country}
                  label={<FormattedMessage id="addresses.form.country" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'addresses.form.country_error',
                      }),
                      required: false,
                    },
                  ]}
                  form={form}
                />
                <Text
                  id="siret"
                  defaultValue={defaultValues && defaultValues.siret}
                  label={<FormattedMessage id="addresses.form.siret" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'addresses.form.siret_error',
                      }),
                      required: false,
                    },
                  ]}
                  form={form}
                />
                <Submit label={{ id: 'addresses.form.submit' }} />
              </Form>
            );
          }}
        </Addresses.Consumer>
      </Addresses.Provider>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  Context.hoc(),
  Addresses.hoc(),
)(AddressForm);

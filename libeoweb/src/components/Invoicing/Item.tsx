import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { FormattedMessage } from 'react-intl';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import {
  DateBox,
  InputBox,
  SelectBox,
  TextAreaBox,
} from 'components/Invoicing';
import { InvoicingIcon } from 'components/Invoicing/Assets';
import { InvoicingIconValue } from 'components/Invoicing/Assets/Icon';
import { IInvoiceData, IProduct } from 'components/Invoicing/types';
import { H2, Span } from 'components/Typo';
import { compose } from 'react-apollo';

interface IProps extends FormComponentProps {
  id: string;
  pushDeleteToParent: (id: string) => void;
  onPricingDetailsChange: (detail: IProduct) => void;
  updateInvoiceData: (changedValues: IInvoiceData) => void;
  getAutoSavedData: () => IInvoiceData;
}

interface IState extends IProduct {
  showNameEdit: boolean;
  showDescriptionEdit: boolean;
}

class Item extends React.PureComponent<IProps, IState> {
  private defaultState = {
    description: 'Add a description for this item',
    id: '0',
    name: 'Item',
    order: 0,
    price: 0,
    quantity: 0,
    showDescriptionEdit: false,
    showNameEdit: false,
    vatRate: 0,
  };
  constructor(props: IProps) {
    super(props);
    this.state = { ...this.defaultState };
    this.restoreState();
  }

  restoreState = () => {
    const { onPricingDetailsChange, getAutoSavedData } = this.props;
    const { products } = getAutoSavedData();
    const { id } = this.props;
    if (products) {
      const detail = products.find(item => item.id === id);
      if (detail) {
        this.state = {
          ...this.state,
          ...detail,
        };
      }
    }
  };

  componentDidUpdate() {
    this.updateDetailsIntoAutoSave();
  }

  pushPricingDetailsChange = (pricingDetail: IProduct) => {
    const { onPricingDetailsChange } = this.props;
    this.setState(
      {
        ...pricingDetail,
      },
      () => {
        onPricingDetailsChange(pricingDetail);
      },
    );
  };

  removeTrailingZeros = (value: string): string => {
    return value.replace(/\.00$/, '');
  };

  roundResult = (value: string): string => {
    return parseFloat(value).toFixed(2);
  };

  calculateTotal = () => {
    const { quantity, price } = this.state;
    if (quantity && price) {
      const result = quantity * price;
      return this.removeTrailingZeros(this.roundResult(result.toString()));
    }
    return 0;
  };

  onDeleteClick = () => {
    const { pushDeleteToParent } = this.props;
    const { id } = this.state;
    this.setState(
      {
        ...this.defaultState,
        id,
      },
      () => {
        pushDeleteToParent(id);
      },
    );
  };

  updateDetailsIntoAutoSave = () => {
    const { id } = this.state;
    const { getAutoSavedData, updateInvoiceData } = this.props;
    const { products } = getAutoSavedData();
    if (products && products.length > 0) {
      const updatedItems = products.map(item => {
        if (item.id === id) {
          return { ...this.state };
        }
        return item;
      });
      updateInvoiceData({
        products: updatedItems,
      });
    }
  };

  onNameChange = (e: any, value: string) => this.setState({ name: value });
  onNameBlur = () => this.setState({ showNameEdit: false });
  onNameClick = () => this.setState({ showNameEdit: true });

  onDescriptionChange = (e: any, value: string) =>
    this.setState({ description: value });
  onDescriptionBlur = () => this.setState({ showDescriptionEdit: false });
  onDescriptionClick = () => this.setState({ showDescriptionEdit: true });

  onQuantityChange = (e: any, value: string) => {
    this.pushPricingDetailsChange({
      ...this.state,
      quantity: Number(value),
    });
  };
  onPriceChange = (e: any, value: string) => {
    this.pushPricingDetailsChange({
      ...this.state,
      price: Number(value),
    });
  };
  onVatRateChange = (e: any, value: string) => {
    this.pushPricingDetailsChange({
      ...this.state,
      vatRate: Number(value),
    });
  };

  render() {
    const { form } = this.props;
    const {
      showDescriptionEdit,
      showNameEdit,
      id,
      name,
      description,
      quantity,
      price,
      vatRate,
    } = this.state;

    return (
      <div className="item" id={id}>
        <div className="delete-icon">
          <Icon
            className="cr-pt"
            onClick={this.onDeleteClick}
            style={{ height: '15px', width: '15px', color: '#AEAEAE' }}
            value={IconValue.Trash}
          />
        </div>
        <Row type="flex" align="middle">
          <Col span={1}>
            <InvoicingIcon
              style={{ cursor: 'grab' }}
              value={InvoicingIconValue.More}
            />
          </Col>
          <Col span={7}>
            {showNameEdit ? (
              <InputBox
                defaultValue={name}
                name={true}
                onBlur={this.onNameBlur}
                placeholder="Enter a name"
                id="text-name"
                form={form}
                onChange={this.onNameChange}
              />
            ) : (
              <H2
                style={{ cursor: 'text' }}
                onClick={this.onNameClick}
                className="fw-400 col-text"
              >
                {name}
              </H2>
            )}

            {showDescriptionEdit ? (
              <InputBox
                defaultValue={description}
                description={true}
                onBlur={this.onDescriptionBlur}
                placeholder="Enter a description"
                id="text-description"
                form={form}
                onChange={this.onDescriptionChange}
              />
            ) : (
              <Span
                style={{ cursor: 'text' }}
                onClick={this.onDescriptionClick}
                className="col-text"
              >
                {description}
              </Span>
            )}
          </Col>
          <Col span={2} offset={1}>
            <InputBox
              defaultValue={`${quantity}`}
              quantity={true}
              id="text-quantity"
              form={form}
              onChange={this.onQuantityChange}
            />
          </Col>
          <Col span={3} offset={1}>
            <InputBox
              defaultValue={`${price}`}
              price={true}
              id="text-price"
              form={form}
              onChange={this.onPriceChange}
            />
          </Col>
          <Col span={2} offset={3}>
            <InputBox
              defaultValue={`${vatRate}`}
              vatRate={true}
              id="text-vatRate"
              form={form}
              onChange={this.onVatRateChange}
              suffix="%"
            />
          </Col>
          <Col span={2} offset={2} className="al-rt pr-10p">
            <Span className="col-text">
              <Span className="mr-5p">{this.calculateTotal()}</Span>
              <FormattedMessage id="invoicing.detail.body.currency.icon" />
            </Span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(Form.create({}))(Item);

import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import Dragula from 'react-dragula';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v4';

import { IPricingInfo, IProduct } from 'components/Invoicing/types';
import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { InputBox, Item, ItemHeader } from 'components/Invoicing';
import { H2, Span } from 'components/Typo';

import {
  calculateTotalAllWithoutVat,
  calculateTotalAllWithVat,
  calculateVatAllInPercent,
} from 'screens/Invoicing/utils/businessLogic';

interface IProps extends FormComponentProps, AutoSave.InjectedProps {}

interface IState extends IPricingInfo {
  items: IProduct[];
}

class DetailProducts extends React.PureComponent<IProps, IState> {
  private defaultState = {
    discount: 0,
    items: [{ id: '0', order: 0, price: 0, quantity: 0, vatRate: 0 }],
    totalAllWithVat: 0,
    totalAllWithoutVat: 0,
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      ...this.defaultState,
    };
    this.restoreState();
  }

  restoreState = () => {
    const { getAutoSavedData } = this.props;
    const { pricingInfo, products } = getAutoSavedData();
    if (products) {
      this.state = {
        ...this.state,
        items: products,
      };
    }
    if (pricingInfo) {
      this.state = {
        ...this.state,
        ...pricingInfo,
      };
    }
  };

  deleteItem = (id: string) => {
    const { items } = this.state;
    if (items.length > 0) {
      if (items.length === 1) {
        const { updateInvoiceData } = this.props;
        this.setState(
          {
            ...this.defaultState,
          },
          () => {
            this.updateCalculations(this.defaultState.items);
          },
        );
        updateInvoiceData({
          products: this.defaultState.items,
        });
      } else {
        const filteredItems = items.filter(item => item.id !== id);
        this.setState({
          items: filteredItems,
        });
        const { getAutoSavedData, updateInvoiceData } = this.props;
        const { products } = getAutoSavedData();
        if (products && products.length > 0) {
          const filteredProducts = products.filter(
            product => product.id !== id,
          );
          this.updateCalculations(filteredProducts);
          updateInvoiceData({
            products: filteredProducts,
          });
        }
      }
    }
  };

  addItem = () => {
    const { items } = this.state;
    let id = '0';
    if (items && items.length > 0) {
      const maxId = items.map(item => item.id).sort()[items.length - 1];
      id = `${parseInt(maxId, 10) + 1}`;
    }
    const details = { id, price: 0, quantity: 0, vatRate: 0, order: 0 };

    const updatedItems = items.concat({ ...details });
    this.setState({
      items: updatedItems,
    });

    this.autoSaveNewItem(details, items.length);
  };

  autoSaveNewItem = (details: IProduct, order: number) => {
    const { getAutoSavedData, updateInvoiceData } = this.props;
    const { products } = getAutoSavedData();
    if (products && products.length > 0) {
      const items = products.concat({ ...details, order });
      this.updateCalculations(items);
      updateInvoiceData({
        products: items,
      });
    }
  };

  dragulaDecorator = (componentBackingInstance: any) => {
    const { items } = this.state;
    const { updateInvoiceData } = this.props;

    if (componentBackingInstance) {
      const options = {};

      const dragula = Dragula([componentBackingInstance], options);
      dragula.on('drop', (el: any, target: any, source: any, sibling: any) => {
        const itemId = el.getAttribute('id');

        const movingItem = items.find(item => item.id === itemId);

        if (movingItem) {
          const itemI = items.indexOf(movingItem);
          let updatedItems: IProduct[] = [];
          items.splice(itemI, 1);
          if (sibling === null) {
            updatedItems = items.concat(movingItem);
          } else {
            const belowId = sibling.getAttribute('id');
            const belowItem = items.find(item => item.id === belowId);
            if (belowItem) {
              const belowI = items.indexOf(belowItem);
              if (itemI < belowI) {
                updatedItems = [
                  ...items.slice(0, belowI + 1),
                  movingItem,
                  ...items.slice(belowI + 1, items.length),
                ];
              } else {
                updatedItems = [
                  ...items.slice(0, belowI),
                  movingItem,
                  ...items.slice(belowI, items.length),
                ];
              }
            }
          }
          if (updatedItems) {
            const products = updatedItems.map((item, index) => {
              return { ...item, order: index };
            });
            updateInvoiceData({
              products,
            });
          }
        }
      });
    }
  };

  roundResult = (value: number): number => {
    return Number(value.toFixed(2));
  };

  updatePricingDetails = (newDetail: IProduct) => {
    const { getAutoSavedData } = this.props;
    const { products } = getAutoSavedData();
    if (products && products.length > 0) {
      const updatedItems = products.map(item => {
        if (item.id === newDetail.id) {
          return { ...newDetail };
        }
        return item;
      });
      this.updateCalculations(updatedItems);
    }
  };

  updateCalculations = (items: IProduct[]) => {
    const { discount = 0 } = this.state;
    const totalAllWithVat = calculateTotalAllWithVat({
      discount,
      items,
    });
    const totalAllWithoutVat = calculateTotalAllWithoutVat({
      discount,
      items,
    });
    const vatAllInPercent = calculateVatAllInPercent({
      items,
    });
    const vatAllTotal = (totalAllWithoutVat * vatAllInPercent) / 100;
    this.setState(
      {
        totalAllWithVat,
        totalAllWithoutVat,
        vatAllInPercent,
        vatAllTotal,
      },
      () => {
        const { updateInvoiceData } = this.props;
        const pricingInfo = { ...this.state };
        delete pricingInfo.items;
        updateInvoiceData({
          pricingInfo,
        });
      },
    );
  };

  onDiscountChange = (e: any, value: string) => {
    this.setState({ discount: Number(value) }, () => {
      const { getAutoSavedData } = this.props;
      const { products } = getAutoSavedData();
      if (products && products.length > 0) {
        this.updateCalculations(products);
      }
    });
  };

  render() {
    const { form } = this.props;
    const { discount, totalAllWithVat, totalAllWithoutVat } = this.state;
    const { getAutoSavedData, updateInvoiceData } = this.props;
    const { items } = this.state;
    return (
      <div className="items">
        <ItemHeader />
        <div className="container" ref={this.dragulaDecorator}>
          {items.map(item => (
            // @ts-ignore
            <Item
              key={item.id}
              id={item.id}
              pushDeleteToParent={this.deleteItem}
              onPricingDetailsChange={this.updatePricingDetails}
              updateInvoiceData={updateInvoiceData}
              getAutoSavedData={getAutoSavedData}
            />
          ))}
        </div>
        <div onClick={this.addItem} className="company-info">
          <Icon value={IconValue.Plus} />
          <a>
            <FormattedMessage id="invoicing.detail.body.item.add" />
          </a>
        </div>
        <div className="disp-end mb-50p">
          <FormattedMessage id={'invoicing.detail.body.discount'} />:
          <div
            style={{
              marginLeft: '15px',
              marginRight: '30px',
              width: '100px',
            }}
          >
            <InputBox
              id="text-discount"
              defaultValue={`${discount}`}
              form={form}
              // TODO fetch the string for this suffix from currency.json
              suffix="EUR"
              price={true}
              onChange={this.onDiscountChange}
            />
          </div>
          <Span>
            <Span className="mr-5p">{discount || 0}</Span>
            <FormattedMessage id="invoicing.detail.body.currency.icon" />
          </Span>
        </div>
        <div className="disp-end">
          <FormattedMessage id={'invoicing.detail.body.total.withoutvat'} />
          <Span style={{ marginLeft: '50px' }}>
            <Span className="mr-5p">
              {this.roundResult(totalAllWithoutVat || 0)}
            </Span>
            <FormattedMessage id="invoicing.detail.body.currency.icon" />
          </Span>
        </div>
        <div className="disp-end">
          <b>
            <FormattedMessage id={'invoicing.detail.body.total.withvat'} />
          </b>
          <b>
            <Span style={{ marginLeft: '50px' }}>
              <Span className="mr-5p">
                {this.roundResult(totalAllWithVat || 0)}
              </Span>
              <FormattedMessage id="invoicing.detail.body.currency.icon" />
            </Span>
          </b>
        </div>
      </div>
    );
  }
}

export default Form.create({})(AutoSave.hoc()(DetailProducts));

// @ts-ignore
import Handlebars from 'handlebars-template-loader/runtime';

Handlebars.registerHelper(
  'multiply',
  (quantity: number, price: number): number => {
    return quantity * price;
  },
);

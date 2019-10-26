import * as React from 'react';

import { IAutoSaveInterface, IInvoiceData } from 'components/Invoicing/types';

const { Provider, Consumer } = React.createContext<IAutoSaveInterface>(
  (() => {
    return {
      getAutoSavedData: () => ({}),
      updateInvoiceData: (data: IInvoiceData) => {},
    };
  })(),
);

export { Provider, Consumer };

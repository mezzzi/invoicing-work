import * as React from 'react';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { FormattedMessage } from 'react-intl';

const NotFound = () => (
  <div className="option-not-found">
    <Icon value={IconValue.EmptySearch} />
    <p className="not-found-title">
      <FormattedMessage id="search.company.search_not_found" />
    </p>
    <p className="not-found-description">
      <FormattedMessage id="search.company.no_data" />
    </p>
  </div>
);

export default NotFound;

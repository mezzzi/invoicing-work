import * as React from 'react';

import { BtnType, Button } from 'components/Button';
import { OnboardingStep } from 'context/Common/types';
import { FormattedMessage } from 'react-intl';
import './Transition.module.less';

interface IProps {
  title?: string;
  img?: any;
  cta?: string;
  step?: OnboardingStep;
  onClickNext?: (step?: OnboardingStep) => void;
  className?: string;
  children?: React.ReactNode;
}

const Transition: React.FunctionComponent<IProps> = ({
  children,
  onClickNext,
  img,
  step,
  cta,
  title,
  className,
}) => (
  <div className={`transition-wrapper${className ? ` ${className}` : ''}`}>
    {title && (
      <span className="transition-title">
        <FormattedMessage id={title} />
      </span>
    )}
    {cta && (
      <Button
        onClick={onClickNext && onClickNext.bind(null, step)}
        type={BtnType.Primary}
      >
        <FormattedMessage id={cta} />
      </Button>
    )}
    <div className="svg-wrapper">{img}</div>
    {children}
  </div>
);

export default Transition;

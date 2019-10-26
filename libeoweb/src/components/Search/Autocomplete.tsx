import { FormComponentProps } from 'antd/lib/form';
import { Text } from 'components/Form';
import { InputRules } from 'components/Form/Default';
import { IInputCompany } from 'context/Company/types.d';
import * as Siren from 'context/Siren';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Results, { PartialIAutocompleteResultProps } from './Results';
const { useState, useEffect } = React;

export interface IAutocompleteProps
  extends PartialIAutocompleteResultProps,
    InjectedIntlProps,
    FormComponentProps,
    Siren.InjectedProps {
  placeholder?: string;
  onSelect?: (item: IInputCompany) => void;
  onSearch?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onLeave?: () => void;
  rules?: InputRules[];
  inline?: boolean;
  type: string;
  defaultOpen?: boolean;
}
export interface IAutocompleteState {
  value: string;
  open?: boolean;
}

let wrapperRef: HTMLDivElement | undefined;

const SearchAutocomplete: React.FunctionComponent<IAutocompleteProps> = ({
  placeholder,
  form,
  onSelect,
  onSearch,
  onValueChange,
  onFocus,
  onBlur,
  onLeave,
  rules,
  inline,
  type,
  intl,
  loading,
  siren,
  defaultOpen,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const setWrapperRef = (node: HTMLDivElement) => {
    if (node) {
      wrapperRef = node;
    }
  };

  const clickOutside = (event: Event) => {
    const target: HTMLElement = event.target as HTMLElement;
    if (target && wrapperRef && !wrapperRef.contains(target)) {
      onLeave && onLeave();
      setOpen(false);
    }

    return true;
  };

  const clickFooter = () => {
    setOpen(false);
    setValue('');
  };

  const blur = (event: React.FocusEvent<HTMLInputElement>) =>
    onBlur && onBlur();

  const focus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus && onFocus();
    setOpen(false);
  };

  const search = async (updatedValue: string): Promise<void> => {
    setValue(updatedValue);
    setOpen(true);
    onSearch && onSearch(updatedValue);
  };

  const change = (node: React.ChangeEvent<Element>): void => {
    const target: any = node.currentTarget;
    onValueChange && onValueChange(target.value);
  };

  const select = async (company: IInputCompany) => {
    let infos;
    if (siren && siren.complementaryInfos && company && company.siren) {
      infos = await siren.complementaryInfos(company.siren);
      if (infos) {
        infos.addresses =
          infos.addresses && infos.addresses.rows && infos.addresses.rows[0]
            ? [infos.addresses.rows[0]]
            : undefined;
        if (infos.addresses[0]) {
          delete (infos.addresses[0] as any).__typename;
          delete infos.addresses[0].id;
          delete (infos.addresses[0] as any).__typename;
        }
        delete (infos as any).__typename;
      }
    }

    onSelect &&
      onSelect({
        ...company,
        ...infos,
      });
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', clickOutside);
    return () => {
      wrapperRef = undefined;
      document.removeEventListener('click', clickOutside as EventListener);
      setValue('');
      onSearch && onSearch('');
    };
  }, []);

  return (
    <div ref={setWrapperRef} className={`search-autocomplete ${type}`}>
      <Text
        autoFocus
        loading={loading}
        rules={rules}
        form={form}
        onSearch={search}
        onChange={change}
        onBlur={blur}
        onFocus={focus}
        button={intl.formatMessage({
          id: 'search.company.btn_search',
        })}
        className="input-autocomplete"
        autoComplete={'off'}
        placeholder={
          !inline && placeholder
            ? intl.formatMessage({
                id: placeholder,
              })
            : undefined
        }
        label={
          inline && placeholder
            ? intl.formatMessage({
                id: placeholder,
              })
            : null
        }
      >
        <Results
          value={value}
          onSelect={select}
          open={open || defaultOpen === true}
          clickFooter={clickFooter}
          type={type}
          {...rest}
        />
      </Text>
    </div>
  );
};

export default compose(
  injectIntl,
  Siren.hoc(),
)(SearchAutocomplete);

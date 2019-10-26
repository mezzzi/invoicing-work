import arrayMove from 'array-move';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Card } from 'components/Card';
import * as AccountingCtx from 'context/Accounting';
import { AccountingPreferenceType } from 'context/Accounting/types';
import * as React from 'react';
import Dragula from 'react-dragula';
import { FormattedMessage } from 'react-intl';
import './TagManager.module.less';
import TagManagerRow, { ITagManagerRowProps } from './TagManagerRow';

interface IProps extends AccountingCtx.InjectedProps {
  rows: ITagManagerRowProps[];
  type: AccountingPreferenceType;
  title?: string;
  add?: boolean;
  editDescription?: boolean;
  editLabel?: boolean;
  editValue?: boolean;
  hasDescription?: boolean;
  reorder?: boolean;
  remove?: boolean;
}

interface IState {
  originalRows?: ITagManagerRowProps[];
  rows?: ITagManagerRowProps[];
}
class TagManager extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    add: false,
    editDescription: false,
    editLabel: false,
    editValue: false,
    hasDescription: false,
    remove: false,
  };

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (state.originalRows !== props.rows && props.rows.length > 0) {
      const isNew =
        state.originalRows && state.originalRows.length < props.rows.length
          ? true
          : false;

      let rows = props.rows.slice(0).sort((a, b) => {
        if (
          typeof a.order === 'undefined' ||
          a.order === null ||
          typeof b.order === 'undefined' ||
          b.order === null
        ) {
          return 0;
        } else if (a.order > b.order) {
          return 1;
        }
        return -1;
      });

      if (isNew) {
        const row = rows.pop();
        rows = [
          ...rows,
          {
            ...row,
            isNew: true,
          },
        ];
      }

      return {
        originalRows: props.rows,
        rows,
      };
    }
    return null;
  }
  state = {
    rows: undefined,
  };

  handleDndRef: (node: React.ReactNode) => void;
  handleOnAdd: (node: React.ReactNode) => void;

  drake: any;
  constructor(props: any) {
    super(props);

    this.handleDndRef = this.dndRef.bind(this);
    this.handleOnAdd = this.onAdd.bind(this);
  }

  onAdd = async () => {
    const { type, accounting } = this.props;

    if (accounting && accounting.createOrUpdateAccountingPreferences) {
      await accounting.createOrUpdateAccountingPreferences(
        [
          {
            description: '',
            enabled: true,
            key: '',
            order: (this.state.rows || []).length,
            type,
            value: '',
          },
        ],
        type,
      );
    }
  };

  dndRef(node: React.ReactNode) {
    if (node) {
      this.drake = Dragula([node], {
        accepts: (el: any, target: any, source: any, sibling: any) => {
          return true;
        },
        copy: false,
        copySortSource: false,
        direction: 'vertical',
        ignoreInputTextSelection: true,
        invalid: (el: any, handle: any) => {
          return false;
        },
        isContainer: (el: any) => {
          return false;
        },
        mirrorContainer: document.body,
        moves: (el: any, source: any, handle: any, sibling: any) => {
          return handle.classList.contains('draggable');
        },
        removeOnSpill: false,
        revertOnSpill: false,
      });

      let from: number = 0;
      this.drake.on('drag', (el: any, source: any) => {
        from = [...source.children].indexOf(el);
      });
      this.drake.on(
        'drop',
        async (el: any, target: any, source: any, sibling: any) => {
          const { accounting } = this.props;
          const to = [...target.children].indexOf(el);
          let rows: any[] = (this.state.rows || []).slice(0);

          if (typeof from !== 'undefined' && typeof to !== 'undefined') {
            rows = arrayMove(rows, from, to);
            let i: number = 0;
            rows = rows.map((row: any) => {
              return {
                description:
                  typeof row.description === 'string'
                    ? `${row.description}`
                    : '',
                enabled: row.enabled,
                id: row.id,
                key: row.key || '',
                order: row.enabled ? i++ : -1,
                type: row.type,
                value: typeof row.value === 'string' ? `${row.value}` : '',
              };
            });

            if (accounting && accounting.createOrUpdateAccountingPreferences) {
              await accounting.createOrUpdateAccountingPreferences(
                rows,
                this.props.type,
              );
            }
          }
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  render() {
    const {
      title,
      type,
      add,
      editDescription,
      editLabel,
      editValue,
      hasDescription,
      remove,
      reorder,
    } = this.props;
    const rows = this.state.rows || [];

    return (
      <div className="tag-manager">
        <Card title={title && <FormattedMessage id={title} />} center shadow>
          <TagManagerRow
            className="tag-manager-header"
            enabled
            editDescription={false}
            editLabel={false}
            editValue={false}
            hasDescription={true}
            remove={false}
            reorder={false}
            type={type}
            label={<FormattedMessage id="accounting_options.thead.label" />}
            description={
              <FormattedMessage id="accounting_options.thead.description" />
            }
            value={<FormattedMessage id="accounting_options.thead.account" />}
          />
          <div
            style={{
              width: '100%',
            }}
            ref={this.handleDndRef}
          >
            {rows.map((row: ITagManagerRowProps, i) => {
              const { key, order, ...props } = row;

              return row.enabled ? (
                <TagManagerRow
                  {...{
                    editDescription,
                    editLabel,
                    editValue,
                    hasDescription,
                    remove,
                    reorder,
                  }}
                  type={type}
                  key={`${i}`}
                  order={i}
                  {...{ ...props, label: key }}
                />
              ) : null;
            })}
          </div>
          {add && (
            <div onClick={this.handleOnAdd} className="tag-manager-row-add">
              <Icon value={IconValue.Plus} />
            </div>
          )}
        </Card>
      </div>
    );
  }
}

export default AccountingCtx.hoc()(TagManager);

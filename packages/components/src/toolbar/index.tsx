import { useState, type ReactElement, useMemo, memo, useCallback } from 'react';
import { useUpdateEffect } from 'ahooks';
import { Button, Row } from 'antd';
import {
  DownOutlined,
  LineChartOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import { useEvent } from '@emiya-origin/hooks';
import FieldControl from './field-control';
import ActionBar, { IActionBarProps } from './action-bar';
import './toolbar.less';

interface IFilters {
  [key: string]: {
    label: string;
    component: ReactElement;
  };
}

export interface IToolbarProps {
  columns?: 3 | 4;
  filters: IFilters;
  actions?: IActionBarProps['actions'];
  values?: IBaseObject;
  onSearch?: (values?: IBaseObject) => void;
  onChange?: (values: IBaseObject | undefined, key: keyof IFilters) => void;
  onReset?: (emptyValues: IBaseObject) => void;
  divider?: boolean;
  className?: string;
  defaultExpand?: boolean;
  queryType?: 'search' | 'statists';
  initialValues?: IBaseObject;
}

export type ToolbarProps = IToolbarProps;

function Toolbar({
  actions,
  columns = 4,
  className,
  divider = true,
  defaultExpand = true,
  filters,
  initialValues,
  onChange,
  onReset,
  onSearch,
  queryType = 'search',
  values,
}: IToolbarProps) {
  const [internalValues, setInternalValues] = useState(initialValues ?? values);
  // Collapse/Expand State
  const [isOpenMore, setIsOpenMore] = useState(defaultExpand);

  const filterKeys = useMemo(
    () => Object.getOwnPropertyNames(filters ?? {}),
    [filters],
  );

  const moreFiltersLimit = useMemo(() => columns * 2, [columns]);

  // Determine whether to display the "Show More" button.
  const shouldShowOpenMore = useMemo(() => {
    const overLimit = filterKeys.length > moreFiltersLimit;
    return overLimit;
  }, [filterKeys.length, moreFiltersLimit]);

  const showFilterKeys = useMemo(() => {
    if (isOpenMore) {
      return filterKeys;
    }
    return shouldShowOpenMore
      ? filterKeys.slice(0, moreFiltersLimit)
      : filterKeys;
  }, [moreFiltersLimit, isOpenMore, shouldShowOpenMore]);

  const fieldControlWrapperClassName = useMemo(
    () => (columns === 3 ? 'columns-3' : ''),
    [columns],
  );

  const searchBtnProps = useMemo(
    () =>
      queryType === 'statists'
        ? {
            icon: <LineChartOutlined />,
            title: '统计',
          }
        : {
            icon: <SearchOutlined />,
            title: '查询',
          },
    [queryType],
  );

  const handleSearch = useEvent(() => {
    onSearch?.(internalValues);
  });

  const handleOpenMore = useCallback(() => {
    setIsOpenMore(openMore => !openMore);
  }, []);

  const handleFieldsValueChange = useCallback(
    (key: string) => {
      return (param: any) => {
        const value =
          param?.target && param?.target instanceof HTMLElement
            ? param?.target.value
            : param;
        onChange?.({ ...values, [key]: value }, key);

        if (values !== undefined) return;

        setInternalValues(prev => ({ ...prev, [key]: value }));
      };
    },
    [onChange, values],
  );

  const handleReset = useEvent(() => {
    onReset?.(
      filterKeys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {}),
    );
    setInternalValues(undefined);
  });

  useUpdateEffect(() => {
    setInternalValues(values);
  }, [values]);

  return (
    <div
      className={clsx(['toolbar-container', className, { spacing: !actions }])}
    >
      <div className={clsx(['toolbar-search-bar', { divider }])}>
        <Row className={'toolbar-search-bar-primary'} align="top">
          {Boolean(filters) &&
            showFilterKeys.map((key, index) => (
              <FieldControl
                // eslint-disable-next-line react/no-array-index-key
                key={`filter-${key}${index}`}
                wrapperClassName={fieldControlWrapperClassName}
                name={key}
                label={filters[key].label}
                value={internalValues?.[key]}
                onChange={handleFieldsValueChange(key)}
              >
                {filters[key].component}
              </FieldControl>
            ))}
        </Row>

        <div className={'toolbar-search-bar-minor'}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {actions?.search ? (
            actions.search
          ) : onSearch ? (
            <Button type="primary" {...searchBtnProps} onClick={handleSearch} />
          ) : null}

          {/* eslint-disable-next-line no-nested-ternary */}
          {actions?.reset ? (
            actions.reset
          ) : onReset ? (
            <Button
              icon={<ReloadOutlined />}
              title="重置"
              onClick={handleReset}
            />
          ) : null}

          <div
            className={clsx('open-more', {
              'tw-invisible': !shouldShowOpenMore,
            })}
          >
            <div onClick={handleOpenMore}>
              {isOpenMore ? (
                <>
                  收起
                  <UpOutlined />
                </>
              ) : (
                <>
                  更多
                  <DownOutlined />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ActionBar actions={actions} />
    </div>
  );
}
Toolbar.ActionBar = ActionBar;

export default memo(Toolbar);

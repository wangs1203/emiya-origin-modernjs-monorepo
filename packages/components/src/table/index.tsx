import type { RefTable } from 'antd/es/table/interface';
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import {
  Table as AntdTable,
  theme,
  Pagination,
  type TableProps as AntdTableProps,
  type PaginationProps,
} from 'antd';
import merge from 'lodash/merge';
import clsx from 'clsx';
import { useTableWrapperRef } from '@emiya-origin/hooks';
import BaseLoader from '../base-loader';
import './table.less';

const { useToken } = theme;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_KEY = 'page';
export const DEFAULT_PAGE_SIZE_KEY = 'size';

export type AntdTableRef = Required<Parameters<RefTable>[0]>['ref'];

export const DEFAULT_PAGINATION: AntdTableProps<any[]>['pagination'] = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: [10, 20, 30, 50],
  showTotal: (total: number) => `共 ${total} 条`,
};

interface ITableProps<T>
  extends Omit<AntdTableProps<T>, 'dataSource' | 'loading'> {
  wrapProps?: HTMLAttributes<HTMLDivElement>;
  data: T[] | undefined;
  loading?: boolean;
}

export type TableProps<RecordType extends object = any> =
  ITableProps<RecordType>;

function InternalBaseTable<T extends Record<string, any> = any>(
  {
    data,
    wrapProps,
    size = 'small',
    rowKey = 'id',
    pagination = DEFAULT_PAGINATION,
    bordered = true,
    scroll,
    rowSelection,
    loading,
    ...props
  }: ITableProps<T>,
  ref: AntdTableRef,
) {
  // `DEFAULT_PAGINATION` represents the default pagination configuration
  const hasPagination = useMemo(() => Boolean(pagination), [pagination]);

  const [wrapperRef, wrapperSize] =
    useTableWrapperRef<HTMLDivElement>(hasPagination);

  // scroll
  const tableScroll = useMemo(
    () => merge({}, wrapperSize, scroll),
    [scroll, wrapperSize],
  );

  const { token } = useToken();

  const styleMerged = useMemo(() => {
    const internalStyle = {
      '--primary-color': token.colorPrimary,
      '--disable-bg-color': token.colorBgContainerDisabled,
      '--scroll-height': `${tableScroll.y}px`,
    } as CSSProperties;
    return wrapProps?.style
      ? { ...wrapProps.style, ...internalStyle }
      : internalStyle;
  }, [
    wrapProps?.style,
    token.colorPrimary,
    token.colorBgContainerDisabled,
    tableScroll.y,
  ]);

  const internalRowSelection = useMemo(
    () => (rowSelection ? { ...rowSelection, fixed: true } : undefined),
    [rowSelection],
  );

  const dataSource = data ?? [];

  /**
   * Custom `Pagination` is for the realization of the form of empty data,
   * the form occupies the full height,
   * data changes `Pagination` does not change position
   */
  const renderPagination = useCallback(() => {
    const paginationSize = (
      ['large', 'middle'].includes(size) ? 'default' : size
    ) as PaginationProps['size'];

    const paginationConfig = merge(
      {},
      { ...DEFAULT_PAGINATION, size: paginationSize },
      pagination,
    );

    return (
      <Pagination
        className={clsx(
          'tw-flex tw-justify-end tw-flex-wrap tw-gap-y-2 !tw-mb-0 !tw-mt-4',
        )}
        {...paginationConfig}
      />
    );
  }, [pagination, size]);

  return (
    <div
      className="emiya-table-container tw-flex-1 tw-min-h-0 tw-relative"
      ref={wrapperRef}
    >
      <BaseLoader spinning={loading} center />
      <div
        {...wrapProps}
        className={clsx([
          'tw-min-h-0',
          'tw-overflow-hidden',
          'base-table-wrapper',
          { empty: dataSource.length === 0 },
        ])}
        style={styleMerged}
      >
        <AntdTable
          ref={ref}
          size={size}
          rowKey={rowKey}
          dataSource={dataSource}
          scroll={tableScroll}
          bordered={bordered}
          rowSelection={internalRowSelection}
          pagination={false}
          {...props}
        />
      </div>
      {hasPagination && renderPagination()}
    </div>
  );
}

const Table = memo(forwardRef(InternalBaseTable)) as unknown as (<
  RecordType extends object = any,
>(
  props: React.PropsWithChildren<ITableProps<RecordType>> & {
    ref?: AntdTableRef;
  },
) => React.ReactElement) & {
  SELECTION_COLUMN: typeof AntdTable.SELECTION_COLUMN;
  EXPAND_COLUMN: typeof AntdTable.EXPAND_COLUMN;
  SELECTION_ALL: typeof AntdTable.SELECTION_ALL;
  SELECTION_INVERT: typeof AntdTable.SELECTION_INVERT;
  SELECTION_NONE: typeof AntdTable.SELECTION_NONE;
  Column: typeof AntdTable.Column;
  ColumnGroup: typeof AntdTable.ColumnGroup;
  Summary: typeof AntdTable.Summary;
};

Table.SELECTION_COLUMN = AntdTable.SELECTION_COLUMN;
Table.EXPAND_COLUMN = AntdTable.EXPAND_COLUMN;
Table.SELECTION_ALL = AntdTable.SELECTION_ALL;
Table.SELECTION_INVERT = AntdTable.SELECTION_INVERT;
Table.SELECTION_NONE = AntdTable.SELECTION_NONE;
Table.Column = AntdTable.Column;
Table.ColumnGroup = AntdTable.ColumnGroup;
Table.Summary = AntdTable.Summary;

export default Table;

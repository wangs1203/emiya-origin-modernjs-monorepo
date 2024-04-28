import React, {
  type PropsWithChildren,
  useCallback,
  isValidElement,
  forwardRef,
  memo,
  useMemo,
} from 'react';
import Toolbar, { type IToolbarProps } from '../toolbar';
import BaseTable, {
  type TableProps,
  type AntdTableRef,
  DEFAULT_PAGINATION,
} from '../table';
import Container from '../container';

export type {
  ColumnProps,
  ColumnGroupType,
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
} from 'antd/es/table';

interface IProTableProps<RecordType extends object = any>
  extends Omit<TableProps<RecordType>, 'pagination'> {
  toolbar?: IToolbarProps;
  pagingParams?: {
    page?: number;
    size?: number;
    total?: number;
  };
  onPaginationChange?: (
    params: Pick<
      Required<Required<IProTableProps>['pagingParams']>,
      'page' | 'size'
    >,
  ) => void;
}

export type ProTableProps<RecordType extends object = any> =
  IProTableProps<RecordType>;

function InternalTable<RecordType extends object = any>(
  {
    toolbar,
    pagingParams,
    onPaginationChange,
    ...props
  }: IProTableProps<RecordType>,
  ref: AntdTableRef,
) {
  const showRenderToolbar = useCallback(() => Boolean(toolbar), [toolbar]);

  const pagination = useMemo(() => {
    if (!('page' in (pagingParams ?? {}))) return false;
    const { total, page: current, size: pageSize } = pagingParams ?? {};

    const onChange = (page: number, pageSize: number) =>
      onPaginationChange?.({ page, size: pageSize });

    return {
      ...DEFAULT_PAGINATION,
      total,
      current,
      pageSize,
      onChange,
    };
  }, [pagingParams, onPaginationChange]);

  const renderToolbar = useCallback(() => {
    if (isValidElement(toolbar)) {
      return toolbar;
    }
    return <Toolbar {...(toolbar as IToolbarProps)} />;
  }, [toolbar]);

  return (
    <Container full>
      {showRenderToolbar() && renderToolbar()}
      <BaseTable {...props} ref={ref} pagination={pagination} />
    </Container>
  );
}

const ProTable = memo(forwardRef(InternalTable)) as unknown as <
  RecordType extends object = any,
>(
  props: PropsWithChildren<
    IProTableProps<RecordType> & {
      ref?: AntdTableRef;
    }
  >,
) => React.ReactElement;

export default ProTable;

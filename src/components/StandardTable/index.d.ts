import React from 'react';
import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';

export interface StandardTableProps {
  columns: any;
  onSelectRow?: (row: any) => void;
  data: any;
  rowKey: string;
  pagination?: any;
  selectedRows: any[];
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<keyof any, string[]>,
    sorter: SorterResult<any>,
    extra?: TableCurrentDataSource<any>
  ) => void;
  loading?: boolean;
  bordered?: boolean;
}

export default class StandardTable extends React.Component<StandardTableProps, any> {}

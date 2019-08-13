import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch } from "redux";
import { connect } from "dva";
import StandardTable from '@/components/StandardTable';
import { UserState } from './model';
import { UserListItemParams } from './data';
import { ColumnProps } from 'antd/lib/table';

interface userListProps {
  dispatch: Dispatch<any>;
  user: UserState
}

interface userListProps {
  dispatch: Dispatch<any>;
  user: UserState
}

const UserList = (props: userListProps) => {
  const [selectedRows, SetRows] = useState([])

  const user = props.user
  const {loading, ...datas} = user
  const data = {
    list: datas.userList,
    pagination: datas.pagination
  }

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'user/getUserList',
    })
  }, [])

  const columns:ColumnProps<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '邮箱地址',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: number) => role ? '普通用户' : '管理员'
    },
    {
      title: '暗号',
      dataIndex: '',
      key: 'x',
      render: (item: any) => {
        return `问:${item.question} 答:${item.answer}`
      }
    }
  ];

  const handleSelectRows = (rows: any) => {
    SetRows(rows)
  };

  const handleStandardTableChange = (pagination: any) => {
    const { dispatch } = props;

    dispatch({
      type: 'user/getUserList',
      payload: pagination
    });
  };

  return (
    <PageHeaderWrapper>
      <StandardTable
        data={data}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectRow={handleSelectRows}
        columns={columns}
        loading={loading}
        onChange={handleStandardTableChange}
      />
    </PageHeaderWrapper>
  )
}

export default connect(
  ({
    user
  }: {
    user: UserListItemParams;
  }) => ({
    user
  })
)(UserList);
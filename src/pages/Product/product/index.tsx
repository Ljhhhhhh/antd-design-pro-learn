import React, { useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch } from "redux";
import { Row, Col, Button, Divider, Popover } from 'antd';
import { connect } from "dva";
import StandardTable from '@/components/StandardTable';
import { ColumnProps } from 'antd/lib/table';
import router from 'umi/router';
import SearchForm from './components/SearchForm';
import { ProductStateProps } from './model';
import { ProductProps } from '@/services/product';

interface TableListProps {
  dispatch: Dispatch<any>;
  product: ProductStateProps;
  loading: {
    models: {
      [key: string]: boolean;
    };
  };
}

interface SearchFormProps {
  searchValue?: string | number
  searchType?: string
  pageNum?: number
}

const List = (props: TableListProps) => {
  const [selectedRows, SetRows] = useState([])
  const [searchValue, SetSearchValue] = useState<SearchFormProps>({})

  const { dispatch, product, loading } = props;

  useEffect(() => {
    fetchList()
  }, [searchValue])

  const fetchList = useCallback((pageConfig?: any) => {
    const { pagination } = props.product;
    dispatch({
      type: 'product/getList',
      payload: {
        ...searchValue,
        pageNum: pageConfig ? pageConfig.current : searchValue.pageNum || pagination.pageNum
      }
    })
  }, [props.product.pagination, searchValue])

  const submit = (values: any) => {
    const data = {
      ...values,
      pageNum: 1
    }
    SetSearchValue(data)
  }

  const changeStatus = (item: any) => {
    const { id, status} = item;
    const newStatus = status === 1 ? 2 : 1;
    dispatch({
      type: 'product/setStatus',
      payload: {
        productId: id,
        status: newStatus
      }
    })
  }

  const columns: ColumnProps<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'subtitle',
      key: 'subtitle'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: '状态',
      dataIndex: '',
      key: 'status',
      width: 120,
      render: (item: any) => {
        interface statusObj {
          statusText: '在售' | '下架'
          btnText: '上架' | '下架'
          btnType: "primary" | "danger"
          btnIcon: "stop" | "to-top"
        }

        let statusObj: statusObj = {
          statusText: '在售',
          btnText: '下架',
          btnType: 'danger',
          btnIcon: 'stop'
        }
        const {status} = item;
        if (status !== 1) {
          statusObj = {
            statusText: '下架',
            btnText: '上架',
            btnType: 'primary',
            btnIcon: 'to-top'
          }
        }
        return (
          <>
            <span>{statusObj.statusText}</span>
            <Divider type="vertical" />
            <Popover content={statusObj.btnText}>
              <Button onClick={() => changeStatus(item)} shape="circle" icon={statusObj.btnIcon} type={statusObj.btnType}/>
            </Popover>
            
          </>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: 220,
      render: (item: any) => {
        return (
          <>
            <Button type="primary" icon="eye" onClick={() =>handleProduct(item.id, false)}>查看</Button>
            <Divider type="vertical" />
            <Button type="ghost" icon="edit" onClick={() =>handleProduct(item.id)}>编辑</Button>
          </>
        )
      }
    }
  ];

  const handleSelectRows = (rows: any) => {
    SetRows(rows)
  };

  const handleStandardTableChange = (pagination: any) => {
    fetchList(pagination)
  };

  const handleProduct = (id?: number, editable?: boolean ) => {
    router.push({
      pathname: '/product/create',
      query: {
        id,
        editable
      }
    })
  }
  
  return (
    <PageHeaderWrapper>
      <Row style={{ marginBottom: 15 }} type="flex" justify="space-between" >
        <Col><SearchForm handleSubmit={submit} /></Col>
        <Col>
          <Button icon="plus" type="primary" onClick={() => handleProduct()}>新建</Button>
        </Col>
      </Row>

      <StandardTable
        data={product}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectRow={handleSelectRows}
        columns={columns}
        loading={!!loading}
        onChange={handleStandardTableChange}
      />
      {/* <ChangeCategoryNameModal
        submit={(v: any) => submitCategoryName(v)}
        visible={modalShow}
        cancelChange={() => cancelChange()}
        originName={selectedCategory.name}
      /> */}
      {/* {
        addModalShow && <CreateCategory 
                          toggleCreate={handleAddModalVisible} 
                          createCategoryShow={addModalShow} 
                          categoryList={data.list} 
                          categoryPath={categoryPath}
                        />
      } */}
    </PageHeaderWrapper>
  )
}

// interface ModalParams {
//   visible: boolean
//   originName?: string
//   submit: (v: any) => void
//   cancelChange: () => void
// }

// const ChangeCategoryNameModal = (props: ModalParams) => {
//   const { visible, submit, cancelChange, originName } = props
//   const defaultValue = {
//     categoryName: originName
//   }
//   if (visible) return (
//     <Modal
//       title="修改分类名称"
//       visible={visible}
//       footer={null}
//       onCancel={cancelChange}
//     >
//       <SchemaForm layout="vertical" onSubmit={submit} defaultValue={defaultValue}>
//         <Field
//           type="string"
//           required
//           name="categoryName"
//         />
//         <FormButtonGroup>
//           <Submit />
//           <Button onClick={cancelChange}>取消</Button>
//         </FormButtonGroup>
//       </SchemaForm>
//     </Modal>
//   );
//   return null
// }

export default connect(
  ({
    product,
    loading
  }: {
    product: ProductProps[];
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    product,
    loading: loading.models.product
  })
)(List);
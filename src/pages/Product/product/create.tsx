import React, { useState, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import SchemaForm, { Field, Submit, Reset, FormButtonGroup, FormLayout } from "@uform/antd";
import { Row, Col, message, Upload, Icon, Button } from 'antd'
import { connect } from "dva";
import { Dispatch } from "redux";
import { CascaderOptionType } from 'antd/lib/cascader'
import { RouteComponentProps } from "react-router";
import withRouter from 'umi/withRouter'
import BraftEditor from 'braft-editor' // 使用文档： https://www.yuque.com/braft-editor/be/lzwpnr
import { UploadFile } from 'antd/lib/upload/interface'
import { ProductProps } from '@/services/product'
import router from 'umi/router'
import { fetchCategory, getProduct } from '@/services/product'
import { BASE_URL } from '@/utils/request'
// impport {getProduct} from '@/'
import { ProductStateProps } from './model';
import { CategoryState } from '../model';
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './style.less'

interface CreateProductProps extends RouteComponentProps {
  dispatch: Dispatch<any>;
  product: ProductStateProps;
  category: CategoryState;
  history: any;
  loading: {
    models: {
      [key: string]: boolean;
    };
  };
}

const CreateProduct = (props: CreateProductProps) => {
  const [productDetail, setProductDetail] = useState<ProductProps>({} as ProductProps)
  const [productContent, setProductContent] = useState<any>('')
  const [categoryParentList, setCategoryParentList] = useState<CascaderOptionType[]>([])
  const [categoryList, setCategoryList] = useState<CascaderOptionType[]>([])
  const [productId, setProductId] = useState(null)
  const [readOnly, setReadOnly] = useState<boolean>(false)
  const [uploadList, setUploadList] = useState<UploadFile[]>([])
  // const [categoryId, setCategoryId] = useState<string[]>([])
  // const [productDetail, setCategoryId] = useState<number | null>(null)

  const { dispatch } = props


  useEffect(() => {
    dispatch({
      type: 'category/getList',
    })
    const { id = null, editable = true } = props.history.location.query;
    if (id) {
      setProductId(id)

      getProduct(id).then(res => {
        const { detail, subImages, imageHost, parentCategoryId } = res.data
        setProductDetail(res.data)
        setProductContent(BraftEditor.createEditorState(detail))
        getCategoryList(parentCategoryId)
        const imageList = subImages.split(',').map((item: string) => {
          return {
            uid: item,
            url: imageHost + item,
            name: item,
            status: 'done',
            forHistory: true
          }
        })
        setUploadList(imageList)
      })
    }
    setReadOnly(!editable)
  }, [])

  useEffect(() => {
    const normalizeCategoryList = props.category.list.map((category: any) => {
      return {
        label: category.name,
        value: category.id
      }
    })
    setCategoryParentList(normalizeCategoryList)
  }, [props.category.list])

  const getCategoryList = (parentCategoryId: number) => {
    setCategoryList([])
    fetchCategory(parentCategoryId).then(res => {
      const list = res.data.map((item: any) => {
        return {
          value: item.id,
          label: item.name
        }
      })
      setCategoryList(list)
    })
  }

  const submit = (values: any) => {
    const detailRaw = productContent as any;
    if (typeof detailRaw.toHTML !== 'function' || !typeof detailRaw.toHTML()) {
      message.error('请填写产品详情');
      return
    }

    const subImages = uploadList.reduce((str, current, index) => {
      let uri
      if (current.response) {
        uri = current.response.data.uri
      } else {
        uri = current.uid
      }
      if (index === 0) {
        return uri
      }
      return str + ',' + uri
    }, '')

    // return;
    const data = {
      ...values,
      subImages,
      id: productId,
      detail: detailRaw.toHTML()
    }

    // 过滤掉值为空的属性
    const payload = Object.keys(data).reduce((obj: any, current: any) => {
      const newObj = { ...obj }
      if (data[current]) {
        newObj[current] = data[current]
      }
      return newObj
    }, {})

    dispatch({
      type: 'product/create',
      payload
    })
  }

  const goBack = () => {
    router.goBack()
  }

  const picChange = useCallback((info: any) => {
    setUploadList([...info.fileList])
  }, [])

  return (
    <PageHeaderWrapper>
      <Row gutter={44}>
        <Col span={12}>
          <SchemaForm
            onSubmit={submit}
            editable={!readOnly}
            initialValues={{
              name: productDetail.name,
              subtitle: productDetail.subtitle,
              price: productDetail.price,
              stock: productDetail.stock,
              parentCategoryId: productDetail.parentCategoryId,
              categoryId: productDetail.categoryId
            }}
          >
            <Field
              title="产品名称"
              type="string"
              name="name"
              required
            />

            <Field
              title="产品描述"
              type="string"
              name="subtitle"
              required
            />
            <FormLayout inline={true}>
              <Field
                title="一级分类"
                enum={categoryParentList}
                type="string"
                name="parentCategoryId"
                required
                x-effect={() => {
                  return {
                    onChange(categoryId: number) {
                      getCategoryList(categoryId)
                    }
                  }
                }}
              />
              {
                categoryList.length ? (
                  <Field
                    title="二级分类"
                    enum={categoryList}
                    type="string"
                    name="categoryId"
                    required
                  />
                ) : null
              }
            </FormLayout>
            <Field
              title="产品价格"
              type="string"
              name="price"
              required
              x-props={{
                suffix: '元'
              }}
            />
            <Field
              title="产品库存"
              type="string"
              name="stock"
              required
              x-props={{
                suffix: '件'
              }}
            />
            <Row type="flex" align="top">
              <Col>产品图片：</Col>
              <Col>
              {/* // uploadList */}
                <Upload
                  fileList={uploadList}
                  listType="picture-card"
                  action={`${BASE_URL}/manage/product/upload.do`}
                  name='upload_file'
                  onChange={picChange}
                  disabled={readOnly}
                  multiple={true}
                >
                  {
                    readOnly ? null : <Icon type="plus" />
                  }
                </Upload>
              </Col>
            </Row>

            <FormButtonGroup>
              <Button onClick={goBack}>返回</Button>
              {
                readOnly ? null : (
                  <>
                    <Submit />
                    <Reset />
                  </>
                )
              }
            </FormButtonGroup>
          </SchemaForm>
        </Col>
        <Col span={12}>
          <p>产品详情</p>
          <BraftEditor
            value={productContent}
            // value={productDetail}
            placeholder="请填写产品详情"
            onChange={(value) => setProductContent(value)}
            readOnly={readOnly}
          />
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default connect(
  ({
    category,
    product,
    loading
  }: {
    category: any;
    product: ProductProps;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    category,
    product,
    loading: loading.models.product
  })
)(withRouter(CreateProduct));
import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import SchemaForm, { Field, Submit, FormButtonGroup } from "@uform/antd";
import { connect } from "dva";
import { Dispatch } from "redux";
import { CategoryItemProps } from '../index'

interface CreateCategoryParams {
  toggleCreate: (flag: boolean) => void
  createCategoryShow: boolean
  categoryList: any[]
  categoryPath: any[]
  dispatch: Dispatch<any>;
}

const CreateCategory = (props: CreateCategoryParams) => {
  const { toggleCreate, createCategoryShow, categoryList, categoryPath, dispatch } = props
  const [parentsCategory, setParentsCategory] = useState<string>('全部/')
  const [normalizeCategoryList, setNormalizeCategoryList] = useState<any[]>([])

  useEffect(() => {
    let parent = {
      label: parentsCategory,
      value: 0
    }
    let categorys: string;
    if (categoryPath.length) {
      categorys = parentsCategory;
      categoryPath.forEach(category => {
        categorys += (category.name + '/')
      })
      setParentsCategory(categorys)

      parent = {
        label: categorys,
        value: categoryPath[categoryPath.length - 1].id
      }

    }

    const list = categoryList.map(item => {
      return {
        label: categorys + item.name,
        value: item.id
      }
    })

    list.unshift(parent)
    setNormalizeCategoryList(list)

  }, [categoryPath])

  const submit = (e: any) => {
    const payload = {
      ...e,
      parentCategoryId: normalizeCategoryList[0].value
    }
    dispatch({
      type: 'category/createCategory',
      payload
    })

    toggleCreate(false)
  }

  return (
    <Drawer visible={createCategoryShow} closable={false} width={500}>
      <SchemaForm layout="vertical" onSubmit={submit}>
        <Field
          type="string"
          enum={normalizeCategoryList}
          required
          title="所属品类"
          name="parentId"
        />
        <Field
          type="string"
          required
          title="品类名称"
          name="categoryName"
        />

        <FormButtonGroup>
          <Submit />
          <Button onClick={() => toggleCreate(false)}>取消</Button>
        </FormButtonGroup>
      </SchemaForm>
    </Drawer>
  )
}

export default connect(
  ({
    category
  }: {
    category: CategoryItemProps;
  }) => ({
    category
  })
)(CreateCategory);
import React from 'react'
// import { Button } from 'antd'
import SchemaForm, { Field, Submit, Reset, FormButtonGroup } from "@uform/antd";

interface searchFormProps {
  handleSubmit: (data: any) => void;
}

const SearchForm = (props: searchFormProps) => {

  const { handleSubmit } = props

  const submit = (value: any) => {
    handleSubmit(value)
  }

  const categoryList = [
    { label: '按商品名', value: 'productName' },
    { label: '按商品ID', value: 'productId' },
  ]

  return (
    <SchemaForm
      layout="inline"
      onSubmit={submit}
      effects={($: any) => {
        $('onFormReset').subscribe(({ values }: any) => {
          submit(values)
        })
      }}
    >
      <Field
        default="productName"
        type="string"
        enum={categoryList}
        name="searchType"
      />
      <Field
        type="string"
        name="searchValue"
      />

      <FormButtonGroup>
        <Submit>搜索</Submit>
        <Reset />
      </FormButtonGroup>
    </SchemaForm>
  )
}

export default SearchForm;
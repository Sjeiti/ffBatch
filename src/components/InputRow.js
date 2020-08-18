import React from 'react'
import styled from 'styled-components'

const Label = styled.label`
  line-height: 100%;
`

export const InputRow = ({children, title})=>{
  const {id} = children.props
  return <div className="mb-3 row" data-row={id}>
    <Label htmlFor={id} className="form-label col-2">{title}</Label>
    <div className="col-10">{children}</div>
  </div>
}

export const InputRowDouble = ({children, title})=>{
  const {id} = children[0].props
  return <div className="mb-3 row" data-row={id}>
    <Label htmlFor={id} className="form-label col-2">{title}</Label>
    <div className="col-5">{children[0]}</div>
    <div className="col-5">{children[1]}</div>
  </div>
}

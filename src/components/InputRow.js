import React from 'react'

export const InputRow = ({children, title})=>{
  const {id} = children.props
  return <div className="mb-3 row">
    <label htmlFor={id} className="form-label col-4">{title}</label>
    <div className="col-8">{children}</div>
  </div>
}

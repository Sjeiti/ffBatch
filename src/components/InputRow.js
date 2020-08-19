import React, {Children} from 'react'
import styled from 'styled-components'

const Label = styled.label`
  line-height: 100%;
`

export const InputRow = ({children, title})=>{
  const {id} = children?.props||children[0]?.props||{id:title.replace(/[^a-zA-Z0-9]/g,'-')}
  const length = Children.count(children)
  const cols = [12,12,6,4,3,2,2][length]||1
  return <div className="mb-3 row" data-row={id}>
    <Label htmlFor={id} className="form-label col-2">{title}</Label>
    <div className="col-10"><div className="row">{Children.map(children, child=>{
      return <div className={`col-${cols}`}>{child}</div>
    })}</div></div>
  </div>
}

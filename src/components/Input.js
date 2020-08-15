import React, {useState, useCallback} from 'react'
import styled from 'styled-components'

const InputNumberRange = styled.input`
  width: 4rem;
  min-height: 1rem;
  margin-left: 0.5rem;
  padding: 0 0.25rem;
  font-size: .875rem;
  line-height: .875rem;
`

export const Input = ({value:_value, onChange:_onChange, ..._attr}) => {
  const [value, setValue] = _onChange?[_value]:useState(_value)
  const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  const attr = {..._attr, value, onChange}
  return <input {...attr} />
}

export const Checkbox = attr => <Input type="checkbox" className="form-check-input" {...attr} />

export const Color = attr => <Input type="color" className="form-control" {...attr} />

export const Hidden = attr => <Input type="hidden" {...attr} />

export const Number = attr => <Input type="number" className="form-control" {...attr} />

export const File = attr => <Input type="file" className="form-control" {...attr} />

export const Range = ({value:_value, onChange:_onChange, ..._attr}) => {
  const [value, setValue] = _onChange?[_value]:useState(_value)
  const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  const attr = {..._attr, value, onChange}
  return <div style={{display:'flex'}}>
    <input type="range" className="form-range" {...attr} />
    <InputNumberRange type="number" className="form-control" {...attr} />
  </div>
}

export const Select = ({options, value:_value, onChange:_onChange, ..._attr}) => {
  const [value, setValue] = _onChange?[_value]:useState(_value)
  const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  const attr = {..._attr, value, onChange}
  return <select className="form-select" {...attr}>{
    (options||[]).map(({text, ...attr})=><option {...attr}>{text}</option>)
  }</select>
}


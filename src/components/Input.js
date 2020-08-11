import React, {useState, useCallback} from 'react'

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
    <input type="number" className="form-control form-control-sm" style={{width:'4rem'}} {...attr} />
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


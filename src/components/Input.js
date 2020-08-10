import React, {useState, useCallback} from 'react'

export const Input = ({value:_value,..._attr}) => {
  const [value, setValue] = useState(_value)
  const onChange = useCallback(e=>setValue(e.target.value))
  const attr = {..._attr, value, onChange}
  return <input {...attr} />
}

export const Checkbox = attr => <Input type="checkbox" className="form-check-input" {...attr} />

export const Color = attr => <Input type="color" className="form-control" {...attr} />

export const Hidden = attr => <Input type="hidden" {...attr} />

export const Number = attr => <Input type="number" className="form-control" {...attr} />

export const Range = ({value:_value, onChange:_onChange, ..._attr}) => {
  const [value, setValue] = _onChange?[_value]:useState(_value)
  const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  //
  // const [vvalue, setValue] = useState(_value)
  // const value = _onChange?_value:vvalue
  // const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  //
  // const [value, setValue] = useState(_value)
  // const onChange = useCallback(e=>setValue(e.target.value))
  //
  // console.log('select',_onChange,_onChange===onChange) // todo: remove log
  const attr = {..._attr, value, onChange}
  return <div style={{display:'flex'}}>
    <input type="range" className="form-range" {...attr} />
    <input type="number" className="form-control" style={{width:'30%'}} {...attr} />
  </div>
}

export const Select = ({options, value:_value, onChange:_onChange, ..._attr}) => {
  const [value, setValue] = _onChange?[_value]:useState(_value)
  const onChange = _onChange||useCallback(e=>setValue(e.target.value))
  // const [value, setValue] = useState(_value===undefined?'':_value)
  // const onChange = useCallback(e=>setValue(e.target.value))
  const attr = {..._attr, value, onChange}
  return <select className="form-select" {...attr}>{
    (options||[]).map(({text, ...attr})=><option {...attr}>{text}</option>)
  }</select>
}


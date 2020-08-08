import React from 'react'

export const Checkbox = (attr) => <input type="checkbox" className="form-check-input" {...attr} />

export const Color = (attr) => <input type="color" className="form-control" {...attr} />

export const Hidden = (attr) => <input type="hidden" {...attr} />

export const Number = (attr) => <input type="number" className="form-control" {...attr} />

export const Range = (attr) => <input type="range" className="form-range" {...attr} />

export const Select = ({options, ...attr}) => {
  return <select className="form-select" {...attr}>{
    (options||[]).map(({text, ...attr})=><option {...attr}>{text}</option>)
  }</select>
}


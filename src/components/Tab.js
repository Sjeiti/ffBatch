import React from 'react'
import styled from 'styled-components'
import {color} from '../style'

const Label = styled.label`
  position: relative;
  display: block;
  margin-bottom: 0;
  padding: 2px @padding 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: 120%;
  cursor: pointer;
`
const Input = styled.input`
  display: none;
  ~${Label} {
    display: inline-block;
    width: auto;
    margin-bottom: 0.5rem;
    padding: 0 1rem 0 0;
    color: ${color.white};
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: ${color.blueLight};
    box-shadow: -2rem 0 0 ${color.blueLight};
    &:hover {
      background-color: ${color.blue};
      box-shadow: -2rem 0 0 ${color.blue};
    }
  }
  ~[data-tab]{
    position: relative;
    max-height: 0;
    padding: 0 @padding;
    overflow: hidden;
    transition: max-height 200ms ease-in-out, padding 200ms ease-in-out;
  }
  &:checked {
    ~${Label} {
      background-color: ${color.greenLight};
      box-shadow: -2rem 0 0 ${color.greenLight};
    }
    ~[data-tab]{
      max-height: 1000px;
      padding: 10px @padding;
      overflow: visible;
    }
  }
  &:disabled {
    ~${Label} {
      background-color: ${color.grey};
      box-shadow: -2rem 0 0 ${color.grey};
      cursor: not-allowed;
    }
    ~[data-tab]{
      max-height: 0;
      padding: 0 @padding;
      overflow: hidden;
    }
  }
`

export const Tab = ({children, title, id, disabled, defaultChecked})=><div>
  {console.log('disabled', disabled)||''}
  <Input type="checkbox" name="tabs" {...{id, disabled, defaultChecked}} />
  <Label htmlFor={id}><h2>{title}</h2></Label>
  <div data-tab>{children}</div>
</div>

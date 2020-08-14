import React from 'react'
import styled from 'styled-components'
import {color} from '../style'

const chars = Array.from(new Array(128)).map((n,i)=>String.fromCharCode(i))

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
    box-shadow: -1rem 0 0 ${color.blueLight};
    &:hover {
      background-color: ${color.blue};
      box-shadow: -1rem 0 0 ${color.blue};
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
      position: relative;
      background-color: ${color.greenLight};
      box-shadow: -1rem 0 0 ${color.greenLight};
      &:before {
        content: '';
        position: absolute;
        left: -3rem;
        top: 0.5rem;
        width: 2rem;
        height: 2rem;
        background-color: inherit;
        clip-path: polygon(0 0, 0% 100%, 100% 50%);
      }
      &:after {
        content: '';
        position: absolute;
        left: calc( -100vw - 2.9rem);
        top: 50%;
        width: 100vw;
        height: 0.25rem;
        background-color: inherit;
        ${props=>{
          const {id} = props
          const nr = id.split('').reduce((acc,s)=>acc+chars.indexOf(s),0)
          return `--deg: ${(nr%80)-40}deg;`
        }}
        transform: translateY(-50%) rotate(var(--deg));
        transform-origin: 100% 50%;
        //clip-path: polygon(0 0, 0% 100%, 100% 50%);
      }
    }
    ~[data-tab]{
      max-height: 128rem;
      padding: 10px @padding;
      overflow: visible;
    }
  }
  &:disabled {
    ~${Label} {
      background-color: ${color.grey};
      box-shadow: -1rem 0 0 ${color.grey};
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
  <Input type="checkbox" name="tabs" {...{id, disabled, defaultChecked}} />
  <Label htmlFor={id}><h2>{title}</h2></Label>
  <div data-tab>{children}</div>
</div>

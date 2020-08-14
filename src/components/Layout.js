import styled from 'styled-components'
import {color, css} from '../style'

export const Layout = styled.div`
  width: 61.875rem;
  min-height: calc(100% - 2rem);
  margin: 1rem auto;
  background-color: ${color.white};
  border-radius: ${css.borderRadius};
  box-shadow: 0.5rem 0.5rem 2rem rgba(0,0,0,0.3);
  overflow: hidden;
`

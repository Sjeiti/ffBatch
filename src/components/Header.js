import styled from 'styled-components'
import {color, css} from '../style'

export const Header = styled.header`
  width: 100%;
  background-color: ${color.green};
  color: ${color.white};
  box-shadow: 2rem 0 0 ${color.green}, -2rem 0 0 ${color.green};
  h1 { line-height: 6rem; }
`

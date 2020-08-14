import styled from 'styled-components'
import {color, css} from '../style'

export const Header = styled.header`
  width: 100%;
  padding: 1.5rem 0;
  margin-bottom: 1rem;
  background-color: ${color.green};
  color: ${color.white};
  box-shadow: 1rem 0 0 ${color.green}, -1rem 0 0 ${color.green};
  border-radius: ${css.borderRadius} ${css.borderRadius} 0 0;
  h1 { line-height: 100%; }
`

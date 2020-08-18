import React from 'react'
import styled from 'styled-components'

const ButtonTextStyled = styled.button`
  margin: 0 1rem;
  padding: 0;
  border: 0;
  background-color: transparent;
  text-shadow: none;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  transform: translateY(0.125rem);
  &:hover {
    color: black;
  }
`
export const ButtonText = attr => <ButtonTextStyled {...attr} type="button" />

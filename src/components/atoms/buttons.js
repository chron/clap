import styled from 'styled-components';

export const Button = styled.button`
  font-size: 36px;
  border: 2px solid ${p => p.theme.borderColor};
  border-radius: 100px;
  padding: 15px 30px;
  cursor: pointer;
  background-color: ${p => p.theme.accentColor};
  box-shadow: 0px 10px 14px -7px #276873;

  &:focus {
    outline: none;
    box-shadow:  0px 0px 10px 3px ${p => p.theme.inactiveColor};
  }

  &:hover {
    filter: brightness(85%);
  }

  &:active {
    filter: brightness(70%);
  }
`;

import styled from 'styled-components';
import { Link as ReactRouterLink } from 'react-router-dom';

export const Link = styled(ReactRouterLink)`
  text-decoration: none;
  font-weight: bold;
  color: ${p => p.theme.inactiveColor};

  &:hover {
    text-decoration: underline;
  }
`;

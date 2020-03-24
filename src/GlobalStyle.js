import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: system-ui;
    background-color: ${p => p.theme.backgroundColor};
    overscroll-behavior: none;
  }
`;

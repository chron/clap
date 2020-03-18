import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from '../GlobalStyle';
import theme from '../theme';

export default function AppWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <GlobalStyle />

      <Router>
        {children}
      </Router>
    </ThemeProvider>
  );
}

import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux'; // Import Provider
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import store from './redux/store'; // Import Redux store
import Router from './router';
import theme from './theme';

function App() {
  return (
    <Provider store={store}> {/* Wrap your entire app in Provider and pass store */}
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <BrowserRouter>
            <Box>
              <Router />
            </Box>
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

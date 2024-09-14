import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Container } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from "./redux/store";


const theme = createTheme({
  palette: {
    primary: {
      main: '#4a8dd3',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false} style={{ padding: 0 }}>
          <App />
        </Container>
      </ThemeProvider>
    </Router>
  </Provider>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary.tsx'
import store from './store/store.ts'
import './styles/scss/main.scss'
import App from './App.tsx'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ReduxProvider>
  </StrictMode>,
)

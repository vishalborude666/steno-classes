import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './app/store'
import ErrorBoundary from './components/common/ErrorBoundary'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e3a8a',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />
    </Provider>
  </React.StrictMode>
)

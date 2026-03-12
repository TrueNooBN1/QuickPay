import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/app/App.tsx'
import { Provider } from 'react-redux'
import store from './services/store/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { TelegramProvider } from './providers/TelegramProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <Provider store={store}>
      <TelegramProvider>
        <BrowserRouter basename=''>
          <App />
        </BrowserRouter>
      </TelegramProvider>
    </Provider>
  </StrictMode>,
)

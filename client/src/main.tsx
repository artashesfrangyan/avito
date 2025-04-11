import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts';
import { BoardProvider } from './context/BoardContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BoardProvider>
        <App />
      </BoardProvider>
    </Provider>
  </StrictMode>,
)

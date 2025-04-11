import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts';
import ModalProvider from 'mui-modal-provider';
import { BoardProvider } from './context/BoardContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BoardProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </BoardProvider>
    </Provider>
  </StrictMode>,
)

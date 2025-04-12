import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import Header from './Header'

describe('Шапка приложения', () => {
  it('отображает ссылки навигации', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText('Все задачи')).toBeInTheDocument()
    expect(screen.getByText('Проекты')).toBeInTheDocument()
  })

  it('отображает кнопку создания задачи', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText('Создать задачу')).toBeInTheDocument()
  })
})
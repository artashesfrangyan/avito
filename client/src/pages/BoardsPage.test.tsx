import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskBoard from './BoardPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Мокаем хуки и сервисы
vi.mock('../store/services/tasks', () => ({
  useGetBoardsQuery: () => ({
    data: [
      { id: 1, name: 'Тестовая Доска' }
    ]
  }),
  useGetBoardTasksQuery: () => ({
    data: [
      { id: 1, title: 'Задача 1', status: 'Backlog' },
      { id: 2, title: 'Задача 2', status: 'InProgress' },
      { id: 3, title: 'Задача 3', status: 'Done' }
    ],
    isLoading: false,
    isError: false
  }),
  useUpdateTaskStatusMutation: () => [vi.fn()]
}));

// Создаем мок store
const createTestStore = () => 
  configureStore({
    reducer: {
      boardId: (state = null, action) => {
        if (action.type === 'boardId/setBoardId') {
          return action.payload;
        }
        return state;
      }
    }
  });

// Вспомогательная функция для рендеринга с провайдерами
const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/board/1']}>
        <Routes>
          <Route path="/board/:id" element={component} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Компонент Доски Задач', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('корректно отображает заголовок доски', () => {
    renderWithProviders(<TaskBoard />);
    expect(screen.getByTestId('board-title')).toHaveTextContent('Тестовая Доска');
  });

  it('отображает все три колонки', () => {
    renderWithProviders(<TaskBoard />);
    expect(screen.getByTestId('column-Backlog')).toBeInTheDocument();
    expect(screen.getByTestId('column-InProgress')).toBeInTheDocument();
    expect(screen.getByTestId('column-Done')).toBeInTheDocument();
  });

  it('отображает задачи в соответствующих колонках', () => {
    renderWithProviders(<TaskBoard />);
    
    // Проверяем, что задачи находятся в правильных колонках
    const backlogColumn = screen.getByTestId('column-Backlog');
    const inProgressColumn = screen.getByTestId('column-InProgress');
    const doneColumn = screen.getByTestId('column-Done');

    expect(backlogColumn).toHaveTextContent('Задача 1');
    expect(inProgressColumn).toHaveTextContent('Задача 2');
    expect(doneColumn).toHaveTextContent('Задача 3');
  });
});

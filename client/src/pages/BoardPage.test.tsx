import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/store';
import BoardsPage from './BoardsPage';
import { Middleware } from '@reduxjs/toolkit';

// Мок данных для тестов
const mockBoards = [
  {
    id: 1,
    name: 'Тестовая доска 1'
  },
  {
    id: 2,
    name: 'Тестовая доска 2'
  }
];

// Базовый мок-объект для RTK Query
const createMockQueryResult = (overrides = {}) => ({
  data: mockBoards,
  isLoading: false,
  isError: false,
  isSuccess: true,
  isUninitialized: false,
  status: 'fulfilled',
  refetch: vi.fn(),
  currentData: mockBoards,
  error: null,
  fulfilledTimeStamp: Date.now(),
  requestId: '',
  originalArgs: undefined,
  startedTimeStamp: Date.now(),
  endpointName: '',
  ...overrides
});

// Создаем мок-функцию для useGetBoardsQuery
const mockUseGetBoardsQuery = vi.fn(() => createMockQueryResult());

// Мок для RTK Query
vi.mock('../store/services/tasks', () => ({
  useGetBoardsQuery: () => mockUseGetBoardsQuery(),
  tasksApi: {
    endpoints: {
      getBoards: {
        select: () => {},
        matchFulfilled: () => {}
      }
    },
    reducer: () => ({}),
    middleware: (() => {
      const middleware: Middleware = () => (next) => (action) => next(action);
      return middleware;
    })(),
    util: {}
  }
}));

// Вспомогательная функция для рендера компонента
const renderBoardsPage = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <BoardsPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('Страница BoardsPage', () => {
  beforeEach(() => {
    // Сбрасываем мок перед каждым тестом
    mockUseGetBoardsQuery.mockClear();
  });

  describe('при рендере', () => {
    it('должна отображать список досок', () => {
      mockUseGetBoardsQuery.mockImplementation(() => createMockQueryResult());
      renderBoardsPage();
      
      expect(screen.getByText('Тестовая доска 1')).toBeInTheDocument();
      expect(screen.getByText('Тестовая доска 2')).toBeInTheDocument();
    });

    it('должна отображать кнопки перехода для каждой доски', () => {
      mockUseGetBoardsQuery.mockImplementation(() => createMockQueryResult());
      renderBoardsPage();
      
      const buttons = screen.getAllByText('Перейти к доске');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('при загрузке данных', () => {
    it('должна корректно обрабатывать пустой список досок', () => {
      mockUseGetBoardsQuery.mockImplementation(() => 
        createMockQueryResult({
          data: [],
          currentData: []
        })
      );

      renderBoardsPage();
      
      const buttons = screen.queryAllByText('Перейти к доске');
      expect(buttons).toHaveLength(0);
    });

    it('должна корректно обрабатывать состояние загрузки', () => {
      mockUseGetBoardsQuery.mockImplementation(() => 
        createMockQueryResult({
          data: undefined,
          currentData: undefined,
          isLoading: true,
          isSuccess: false,
          status: 'pending'
        })
      );

      renderBoardsPage();
      
      const buttons = screen.queryAllByText('Перейти к доске');
      expect(buttons).toHaveLength(0);
    });

    it('должна корректно обрабатывать состояние ошибки', () => {
      mockUseGetBoardsQuery.mockImplementation(() => 
        createMockQueryResult({
          data: undefined,
          currentData: undefined,
          isError: true,
          isSuccess: false,
          error: { status: 500, data: 'Server Error' },
          status: 'rejected'
        })
      );

      renderBoardsPage();
      
      const buttons = screen.queryAllByText('Перейти к доске');
      expect(buttons).toHaveLength(0);
    });
  });
});

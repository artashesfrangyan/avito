import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ModalProvider } from 'mui-modal-provider';
import IssuesPage from './IssuesPage';
import { tasksApi } from '../store/services/tasks';
import { useGetTasksWithBoards } from '../hooks/useGetTasksWithBoards';
import '@testing-library/jest-dom';
import { ITask } from '../types/task';

// Тестовые данные
const mockTasks: ITask[] = [
  {
    boardId: 1,
    id: 1,
    title: 'Тестовая задача 1',
    description: 'Описание задачи 1',
    priority: 'High',
    status: 'InProgress',
    assignee: { 
      id: 1,
      fullName: 'Иван Иванов',
      email: 'ivan@example.com',
      avatarUrl: 'https://randomuser.me/api/portraits/men/10.jpg'
    },
    boardName: 'Основная доска',
    assigneeId: 1
  },
  {
    boardId: 2,
    id: 2,
    title: 'Тестовая задача 2',
    description: 'Описание задачи 2',
    priority: 'Medium',
    status: 'Done',
    assignee: {
      id: 2,
      fullName: 'Мария Петрова',
      email: 'maria@example.com',
      avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg'
    },
    boardName: 'Вторая доска',
    assigneeId: 2
  }
];

vi.mock('../hooks/useGetTasksWithBoards', () => ({
  useGetTasksWithBoards: vi.fn()
}));

const mockShowModal = vi.fn();
vi.mock('mui-modal-provider', () => ({
  useModal: () => ({ showModal: mockShowModal }),
  ModalProvider: ({ children }: { children: React.ReactNode }) => children
}));


// Настройка store для тестов
const createTestStore = () => {
  return configureStore({
    reducer: {
      [tasksApi.reducerPath]: tasksApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tasksApi.middleware)
  });
};

// Вспомогательная функция для рендеринга с провайдерами
const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ModalProvider>
        {component}
      </ModalProvider>
    </Provider>
  );
};

describe('Страница задач', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetTasksWithBoards).mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false
    });
  });
  
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('отображает состояние ошибки', () => {
    vi.mocked(useGetTasksWithBoards).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true
    });

    renderWithProviders(<IssuesPage />);
    expect(screen.getByText('Ошибка загрузки задач')).toBeInTheDocument();
  });

  it('корректно отображает список задач', () => {
    renderWithProviders(<IssuesPage />);
    
    expect(screen.getByText('Тестовая задача 1')).toBeInTheDocument();
    expect(screen.getByText('Тестовая задача 2')).toBeInTheDocument();
  });

  it('открывает модальное окно создания задачи', async () => {
    renderWithProviders(<IssuesPage />);
    
    const createButton = screen.getByText('Создать задачу');
    fireEvent.click(createButton);

    expect(mockShowModal).toHaveBeenCalled();
  });

  it('открывает модальное окно редактирования задачи', async () => {
    renderWithProviders(<IssuesPage />);
    
    const task = screen.getByText('Тестовая задача 1');
    fireEvent.click(task);

    expect(mockShowModal).toHaveBeenCalled();
  });
});
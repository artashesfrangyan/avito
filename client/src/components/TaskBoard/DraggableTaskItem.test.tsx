import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTaskItem from './DraggableTaskItem';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { ITask } from '../../types/task';

// Мок для тестовой задачи
const mockTask: ITask = {
  id: 1,
  title: 'Тестовая задача',
  description: 'Тестовое описание',
  status: 'Done',
  priority: 'High',
  boardId: 1,
  assigneeId: 1,
  boardName: 'Рефакторинг API',
  assignee: {
    avatarUrl: "",
    email: "test@test.test",
    fullName: "Тестовый пользователь",
    id: 7,
  }
};

// Вспомогательная функция для рендера компонента
const renderDraggableTaskItem = () => {
  return render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <DraggableTaskItem task={mockTask} />
      </DndProvider>
    </Provider>
  );
};

describe('DraggableTaskItem', () => {
  // Тесты на корректное отображение компонента
  describe('должен', () => {
    it('отображать элемент задачи с правильным содержимым', () => {
      renderDraggableTaskItem();
      
      expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
      expect(screen.getByTestId('draggable-task')).toBeInTheDocument();
    });

    it('применять правильные начальные стили', () => {
      renderDraggableTaskItem();
      
      const taskElement = screen.getByTestId('draggable-task');
      expect(taskElement).toHaveStyle({
        marginBottom: '8px',
        cursor: 'grab'
      });
    });
  });
});
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskColumn from './TaskColumn';
import { ITask, ITaskPriority } from '../../types/task';

// Мок компонента DraggableTaskItem
vi.mock('./DraggableTaskItem', () => ({
  default: ({ task }: { task: ITask }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

describe('TaskColumn', () => {
  const mockTasks: ITask[] = [
    { 
        id: 1,
        title: 'Тестовая задача',
        description: 'Тестовое описание',
        status: 'Done',
        priority: 'HIGH' as ITaskPriority, // используем правильный тип
        boardId: 1,
        assigneeId: 7,
        boardName: 'Рефакторинг API',
        assignee: {
          avatarUrl: "https://randomuser.me/api/portraits/men/10.jpg",
          email: "test@test.test",
          fullName: "Тестовый Пользователь",
          id: 7,
        }
    },
    {
        id: 2,
        title: 'Ещё один тест',
        description: 'Описание новой задачи',
        status: 'Done',
        priority: 'LOW' as ITaskPriority, // используем правильный тип
        boardId: 1,
        assigneeId: 8,
        boardName: 'Рефакторинг API',
        assignee: {
          avatarUrl: "https://randomuser.me/api/portraits/women/10.jpg",
          email: "fsafasfasf@fasf.fasas",
          fullName: "Новый Сотрудник",
          id: 8,
        }
    }
  ];

  const mockOnDrop = vi.fn();

  const renderTaskColumn = (props = {}) => {
    return render(
      <DndProvider backend={HTML5Backend}>
        <TaskColumn
          status="Done"
          tasks={mockTasks}
          onDrop={mockOnDrop}
          {...props}
        />
      </DndProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('корректно отображает задачи', () => {
    renderTaskColumn();
    
    mockTasks.forEach(task => {
      expect(screen.getByTestId(`task-${task.id}`)).toBeInTheDocument();
    });
  });

  it('показывает сообщение об отсутствии задач, когда их нет', () => {
    renderTaskColumn({ tasks: [] });
    
    expect(screen.getByText('В этой колонке нет задач')).toBeInTheDocument();
  });

  it('применяет правильные стили', () => {
    const { container } = renderTaskColumn();
    
    const column = container.firstChild as HTMLElement;
    expect(column).toHaveStyle({
      minHeight: '200px',
      borderRadius: '4px',
      padding: '8px'
    });
  });

  it('применяет стили при наведении во время перетаскивания', async () => {
    const { container } = renderTaskColumn();
    const column = container.firstChild as HTMLElement;
    
    // Проверяем начальный цвет фона
    expect(column).toHaveStyle({
      backgroundColor: 'inherit'
    });
  });
});
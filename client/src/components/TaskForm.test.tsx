import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store/store';
import TaskForm from './TaskForm';
import { ITask } from '../types/task';
import { DialogProps } from '@mui/material';

// Мок существующей задачи
const existingTask: Partial<ITask> = {
  id: 1,
  title: 'Тестовое задание',
  description: 'Разработка системы управления проектами для Avito',
  boardId: 1,
  status: 'Done',
  priority: 'High',
  assigneeId: 1
};

interface RenderTaskFormProps extends Omit<DialogProps, 'onClose'> {
  task: Partial<ITask> | null;
  open: boolean;
  onClose?: (event: React.MouseEvent<HTMLElement>, reason: 'backdropClick' | 'escapeKeyDown') => void;
  boardId?: number;
}

describe('В форме задачи:', () => {
  // Вспомогательная функция для рендера компонента
  const renderTaskForm = (props: RenderTaskFormProps) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <TaskForm {...props} />
        </BrowserRouter>
      </Provider>
    );
  };

  describe('Кнопка перехода на доску', () => {
    it('не должна отображаться при открытии со страницы доски', () => {
      renderTaskForm({ 
        task: existingTask, 
        open: true
      });

      const goToBoardButton = screen.queryByText('Перейти на доску');
      expect(goToBoardButton).not.toBeInTheDocument();
    });
  });

  describe('Форма', () => {
    it('должна проверять обязательные поля перед отправкой', () => {
      renderTaskForm({ task: null, open: true });

      const submitButton = screen.getByText('Создать');
      expect(submitButton).toBeDisabled();

      // Заполняем только название
      fireEvent.change(screen.getByLabelText('Название *'), {
        target: { value: 'Новая задача' }
      });

      // Кнопка должна оставаться неактивной, пока не заполнены все обязательные поля
      expect(submitButton).toBeDisabled();
    });
  });
});
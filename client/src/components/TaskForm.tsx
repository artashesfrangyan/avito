import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, ListItemAvatar, Avatar, ListItemText, DialogProps } from '@mui/material';
import { useGetUsersQuery } from '../store/services/users';
import { useGetBoardsQuery } from '../store/services/boards';
import { IFormData } from '../types/form';
import { useCreateTaskMutation, useUpdateTaskMutation } from '../store/services/tasks';
import { ITask } from '../types/task';

// Ключ для сохранения в localStorage
const FORM_STORAGE_KEY = 'unsaved_task_form_data';

const blankForm: Partial<ITask> = {
  title: '',
  description: '',
  priority: null,
  assigneeId: undefined,
  boardId: undefined,
  status: null
}

interface Props extends DialogProps {
  task: Partial<ITask> | null;
}

const TaskForm: React.FC<Props> = ({ task, onClose, ...props }) => {
  // Загрузка сохраненных данных из localStorage при инициализации
  const loadSavedFormData = (): Partial<ITask> => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : blankForm;
    } catch {
      return blankForm
    }
  };

  const [formValues, setFormValues] = useState<Partial<ITask>>(task ? {...task, assigneeId: task.assignee?.id} : loadSavedFormData);

  // Сохранение данных формы в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery();
  const { data: boards = [], isLoading: isBoardsLoading } = useGetBoardsQuery();

  const handleChange = (field: keyof IFormData) => (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormValues(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formValues.boardId || !formValues.assigneeId) return;
      
      if (task) {
        await updateTask(formValues)
      } else {
        await createTask(formValues).unwrap();
      }
      
      // Очищаем сохраненные данные при успешной отправке
      localStorage.removeItem(FORM_STORAGE_KEY);
      onClose();
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  };

  const handleClose = React.useCallback<Exclude<DialogProps['onClose'], undefined>>((...args) => {
    setFormValues(blankForm); 
    localStorage.removeItem(FORM_STORAGE_KEY); 
    onClose(...args);
  }, [onClose]);

  return (
    <Dialog {...props} onClose={handleClose}>
      <DialogTitle>{task ? "Редактирование" : "Создание"} задачи</DialogTitle>
      <DialogContent>
        <TextField
          label="Название"
          value={formValues.title}
          onChange={handleChange('title')}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Описание"
          value={formValues.description}
          onChange={handleChange('description')}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="board-label">Проект *</InputLabel>
          <Select
            labelId="board-label"
            value={formValues.boardId ?? ''}
            onChange={handleChange('boardId')}
            disabled={isBoardsLoading}
            required
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">Приоритет</InputLabel>
          <Select
            labelId="priority-label"
            value={formValues.priority || ''}
            onChange={handleChange('priority')}
          >
            <MenuItem value="Low">Низкий</MenuItem>
            <MenuItem value="Medium">Средний</MenuItem>
            <MenuItem value="High">Высокий</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            value={formValues.status || ''}
            onChange={handleChange('status')}
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="assignee-label">Исполнитель *</InputLabel>
          <Select
            labelId="assignee-label"
            value={formValues.assigneeId ?? ''}
            onChange={handleChange('assigneeId')}
            disabled={isUsersLoading}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box display="flex" alignItems="center">
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatarUrl} 
                      sx={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.fullName}
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !formValues.title || !formValues.boardId || !formValues.assigneeId}
          variant="contained"
          color="primary"
        >
          {task ? 'Изменить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
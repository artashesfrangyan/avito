import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { useGetUsersQuery } from '../store/services/users';
import { useGetBoardsQuery } from '../store/services/boards';
import { IFormData } from '../types/form';
import { useCreateTaskMutation } from '../store/services/tasks';

// Ключ для сохранения в localStorage
const FORM_STORAGE_KEY = 'unsaved_task_form_data';

const blankForm: IFormData = {
  title: '',
  description: '',
  priority: null,
  assigneeId: null,
  boardId: null,
  status: null
}

const TaskForm: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose, project, task }) => {
  // Загрузка сохраненных данных из localStorage при инициализации
  const loadSavedFormData = (): IFormData => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : blankForm;
    } catch {
      return blankForm
    }
  };

  const [formValues, setFormValues] = useState<IFormData>(loadSavedFormData);

  console.log(formValues.boardId)

  // Сохранение данных формы в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  const [createTask, { isLoading }] = useCreateTaskMutation();
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
      
      await createTask({
        title: formValues.title,
        description: formValues.description,
        priority: formValues.priority,
        assigneeId: formValues.assigneeId,
        boardId: formValues.boardId,
        status: formValues.status
      }).unwrap();
      
      // Очищаем сохраненные данные при успешной отправке
      localStorage.removeItem(FORM_STORAGE_KEY);
      onClose();
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => {setFormValues(blankForm); localStorage.removeItem(FORM_STORAGE_KEY); handleClose()}}>
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
            value={formValues.priority}
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
            value={formValues.status}
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
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !formValues.title || !formValues.boardId || !formValues.assigneeId}
          variant="contained"
          color="primary"
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
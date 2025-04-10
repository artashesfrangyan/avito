import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createTaskAsync } from '../store/tasks/tasksThunks';
import { AppDispatch } from '../store/store';
import { fetchBoardsAsync, selectBoards } from '../store/boards/boardsSlice';
import { setFormData } from '../store/form/formSlice';
import { useGetUsersQuery } from '../store/services/users';

// Компонент формы для создания задачи
const TaskForm: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий
  
  const { data: users } = useGetUsersQuery();

  const boards = useSelector(selectBoards); // Получаем доски из стора
  React.useEffect(() => {
    dispatch(fetchBoardsAsync()); // Загружаем доски при монтировании компонента
  }, [dispatch]);

  const formData = useSelector((state: { form: FormData }) => state.form); // Получаем данные формы из Redux
  
  // Обработчик отправки формы
  const handleSubmit = () => {
    dispatch(createTaskAsync({ 
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assigneeId: formData.assigneeId,
      boardId: formData.boardId,
    })); // Отправляем задачу на сервер
    onClose(); // Закрываем попап
  };

  return (
    <Dialog open={open} onClose={onClose}> {/* Попап для создания задачи */}
      <DialogTitle>Создание задачи</DialogTitle>
      <DialogContent>
        <TextField
          label="Название"
          value={formData.title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Описание"
          value={formData.description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="board-label">Проект</InputLabel>
          <Select
            labelId="board-label"
            value={formData.boardId}
            onChange={(e) => dispatch(setFormData({ boardId: Number(e.target.value) }))}
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
            // value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="assignee-label">Исполнитель</InputLabel>
          <Select
            labelId="assignee-label"
            // value={assigneeId}
            onChange={(e) => setAssigneeId(Number(e.target.value))}
          >
            {Array.isArray(users) && users.map((user) => ( // Проверяем, что users является массивом
              <MenuItem key={user.id} value={user.id}>
                {user.fullName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit}>Создать</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
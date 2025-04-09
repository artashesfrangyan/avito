import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createTaskAsync } from '../redux/tasks/tasksThunks';
import { AppDispatch } from '../redux/store';
import { selectBoards } from '../redux/boards/boardsSlice';
import { fetchUsers } from '../redux/users/usersApi';
import { selectUsers } from '../redux/users/usersSlice';

// Компонент формы для создания задачи
const TaskForm: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
  const [title, setTitle] = useState(''); // Название задачи
  const [description, setDescription] = useState(''); // Описание задачи
  const [priority, setPriority] = useState('Medium'); // Приоритет задачи
  const [status, setStatus] = useState('Backlog'); // Статус задачи
  const [assigneeId, setAssigneeId] = useState(0); // Исполнитель задачи
  const [selectedBoardId, setSelectedBoardId] = useState(0); // Выбранная доска

  const boards = useSelector(selectBoards); // Получаем доски из стора
  const users = useSelector(selectUsers); // Получаем доски из стора
  
  const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий

  // Получаем исполнителей с сервера
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Обработчик отправки формы
  const handleSubmit = () => {
    dispatch(createTaskAsync({ assigneeId, boardId: selectedBoardId, description, priority, title, status })); // Отправляем задачу на сервер
    onClose(); // Закрываем попап
  };

  return (
    <Dialog open={open} onClose={onClose}> {/* Попап для создания задачи */}
      <DialogTitle>Создание задачи</DialogTitle>
      <DialogContent>
        <TextField
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="board-label">Проект</InputLabel>
          <Select
            labelId="board-label"
            value={selectedBoardId}
            onChange={(e) => setSelectedBoardId(Number(e.target.value))}
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
            value={priority}
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
            value={assigneeId}
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
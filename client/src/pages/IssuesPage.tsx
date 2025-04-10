import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTaskAsync } from '../redux/tasks/tasksThunks';
import { List, ListItem, ListItemText, Container, TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { AppDispatch } from '../redux/store';
import TaskForm from '../components/TaskForm';
import { ITask } from '../types/task';
import { selectTasks } from '../redux/tasks/tasksSlice';
import { fetchBoardsAsync, selectBoards } from '../redux/boards/boardsSlice';
import { useNavigate } from 'react-router-dom';

// Компонент страницы всех задач
const IssuesPage: React.FC = () => {
  const [open, setOpen] = useState(false); // Состояние попапа
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null); // Выбранная задача
  const [searchTitle, setSearchTitle] = useState(''); // Поиск по названию задачи
  const [searchAssignee, setSearchAssignee] = useState(''); // Поиск по исполнителю
  const [filterStatus, setFilterStatus] = useState(''); // Фильтр по статусу задачи
  const [filterBoard, setFilterBoard] = useState(''); // Фильтр по доске

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий
  const tasks = useSelector(selectTasks); // Получаем задачи из Redux
  React.useEffect(() => {
    dispatch(fetchTasks()); // Загружаем задачи при монтировании компонента
  }, [dispatch]);

  // Получаем задачи с сервера
  React.useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const boards = useSelector(selectBoards); // Получаем доски из стора
  React.useEffect(() => {
    dispatch(fetchBoardsAsync()); // Загружаем доски при монтировании компонента
  }, [dispatch]);

  // Обработчик закрытия попапа
  const handleClose = () => {
    setOpen(false);
  };

  // Обработчик открытия задачи
  const handleTaskClick = (task: ITask) => {
    setSelectedTask(task);
    setOpen(true);
  };

  // Обработчик обновления задачи
  const handleUpdateTask = (updatedTask: ITask) => {
    dispatch(updateTaskAsync(updatedTask)); // Обновляем задачу на сервере
    handleClose(); // Закрываем попап
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    return (
      (searchTitle === '' || task.title.toLowerCase().includes(searchTitle.toLowerCase())) &&
      (searchAssignee === '' || task?.assignee?.fullName.toLowerCase().includes(searchAssignee.toLowerCase())) &&
      (filterStatus === '' || task.status === filterStatus) &&
      (filterBoard === '' || task.boardName === filterBoard)
    );
  });
  
  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Box display="flex" gap={2} style={{ marginTop: '20px' }}>
        <TextField
          label="Поиск по названию задачи"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Поиск по исполнителю"
          value={searchAssignee}
          onChange={(e) => setSearchAssignee(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Фильтр по статусу</InputLabel>
          <Select
            labelId="status-label"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="board-label">Фильтр по доске</InputLabel>
          <Select
            labelId="board-label"
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {boards.map(({name, id}) => (
              <MenuItem key={id} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <List>
        {filteredTasks.map((task) => (
          <ListItem key={task.id} onClick={() => navigate(`/board/${task.id}`)}>
          <ListItemText primary={task.title} />
        </ListItem>
        ))}
      </List>
      <TaskForm open={open} onClose={handleClose} task={selectedTask} onUpdateTask={handleUpdateTask} />
    </Container>
  );
};

export default IssuesPage;
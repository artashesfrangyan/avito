import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasks } from '../redux/tasks/tasksSlice';
import { List, ListItem, ListItemText, Container, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AppDispatch } from '../redux/store';
import TaskForm from '../components/TaskForm';
import { fetchTasks, updateTaskAsync } from '../redux/tasks/tasksThunks';
import { ITask } from '../types/task';

// Компонент страницы всех задач
const IssuesPage: React.FC = () => {
  const [open, setOpen] = useState(false); // Состояние попапа
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null); // Выбранная задача
  const [searchTitle, setSearchTitle] = useState(''); // Поиск по названию задачи
  const [searchAssignee, setSearchAssignee] = useState(''); // Поиск по исполнителю
  const [filterStatus, setFilterStatus] = useState(''); // Фильтр по статусу задачи
  const [filterBoard, setFilterBoard] = useState(''); // Фильтр по доске

  const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий
  const tasks = useSelector(selectTasks); // Получаем задачи из Redux

  // Получаем задачи с сервера
  React.useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Обработчик открытия попапа
  const handleOpen = () => {
    setOpen(true);
  };
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
      (searchAssignee === '' || task.assignee.fullName.toLowerCase().includes(searchAssignee.toLowerCase())) &&
      (filterStatus === '' || task.status === filterStatus) &&
      (filterBoard === '' || task.board.name === filterBoard)
    );
  });

  return (
    <Container maxWidth="lg" style={{backgroundColor: 'white'}}>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <TextField
            label="Поиск по названию задачи"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Поиск по исполнителю"
            value={searchAssignee}
            onChange={(e) => setSearchAssignee(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="board-label">Фильтр по доске</InputLabel>
            <Select
              labelId="board-label"
              value={filterBoard}
              onChange={(e) => setFilterBoard(e.target.value)}
            >
              <MenuItem value="">Все</MenuItem>
              {tasks.map((task) => (
                <MenuItem key={task.board.id} value={task.board.name}>
                  {task.board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <List>
            {filteredTasks.map((task) => (
              <ListItem key={task.id} button onClick={() => handleTaskClick(task)}>
                <ListItemText primary={task.title} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <TaskForm open={open} onClose={handleClose} task={selectedTask} onUpdateTask={handleUpdateTask} />
    </Container>
  );
};

export default IssuesPage;
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTaskAsync } from '../redux/tasks/tasksThunks';
import { selectTasks } from '../redux/tasks/tasksSlice';
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Container, Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { AppDispatch } from '../redux/store';
import TaskForm from '../components/TaskForm';
import { useNavigate } from 'react-router-dom';
import { ITask } from '../types/task';

// Тип для Drag-and-drop
interface TaskItemType {
    id: number;
    index: number;
  }
  
  // Компонент страницы доски
  const BoardPage: React.FC = () => {
    const [open, setOpen] = useState(false); // Состояние попапа
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null); // Выбранная задача
    const [searchTitle, setSearchTitle] = useState(''); // Поиск по названию задачи
    const [searchAssignee, setSearchAssignee] = useState(''); // Поиск по исполнителю
    const [filterStatus, setFilterStatus] = useState(''); // Фильтр по статусу задачи
    const [filterBoard, setFilterBoard] = useState(''); // Фильтр по доске
  
    const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий
    const tasks = useSelector(selectTasks); // Получаем задачи из Redux
    const navigate = useNavigate(); // Получаем функцию для навигации
  
    // Получаем задачи с сервера
    React.useEffect(() => {
      dispatch(fetchTasks());
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
        (searchAssignee === '' || task.assignee.fullName.toLowerCase().includes(searchAssignee.toLowerCase())) &&
        (filterStatus === '' || task.status === filterStatus) &&
        (filterBoard === '' || task.boardName === filterBoard)
      );
    });
  
    // Drag-and-drop
    const moveTask = (dragIndex: number, hoverIndex: number) => {
      const dragTask = filteredTasks[dragIndex];
      const hoverTask = filteredTasks[hoverIndex];
  
      // Обновляем статус задачи
      const updatedTask = {
        ...dragTask,
        status: hoverTask.status,
      };
      dispatch(updateTaskAsync(updatedTask));
    };
  
    const TaskItem = ({ task, index }: { task: ITask; index: number }) => {
      const { isDragging, drag } = useDrag({
        type: 'task',
        item: { id: task.id, index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      });
  
      const { isOver, drop } = useDrop({
        accept: 'task',
        hover(item: TaskItemType, monitor) {
          if (!isOver) {
            return;
          }
  
          const dragIndex = item.index;
          const hoverIndex = index;
  
          if (dragIndex === hoverIndex) {
            return;
          }
  
          moveTask(dragIndex, hoverIndex);
          item.index = hoverIndex;
        },
      });
  
      return (
        <ListItem
          key={task.id}
          ref={drop}
          style={{ opacity: isDragging ? 0.5 : 1 }}
          onClick={() => handleTaskClick(task)}
        >
          <ListItemText primary={task.title} />
        </ListItem>
      );
    };
  
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Доска</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => navigate('/issues/create')}>Создать задачу</Button>
          </Toolbar>
        </AppBar>
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
            <DndProvider backend={HTML5Backend}>
              <DndContext>
                <List>
                  {filteredTasks.map((task, index) => (
                    <TaskItem key={task.id} task={task} index={index} />
                  ))}
                </List>
              </DndContext>
            </DndProvider>
          </Grid>
        </Grid>
        <TaskForm open={open} onClose={handleClose} task={selectedTask} onUpdateTask={handleUpdateTask} />
      </Container>
    );
  };
  
  export default BoardPage;
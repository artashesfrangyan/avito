import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Container, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetTasksQuery, useUpdateTaskMutation } from '../store/services/tasks';
import TaskForm from '../components/TaskForm';
import { ITask } from '../types/task';
import { useGetBoardsQuery } from '../store/services/boards';

// Компонент страницы всех задач
const IssuesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAssignee, setSearchAssignee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBoard, setFilterBoard] = useState('');

  const navigate = useNavigate();

  const { data: boards = [] } = useGetBoardsQuery();

  // Получаем данные с помощью RTK Query
  const { 
    data: tasks, 
    isLoading: isTasksLoading, 
    isError: isTasksError, 
    error: tasksError 
  } = useGetTasksQuery();

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = async (updatedTask: ITask) => {
    try {
      await updateTask(updatedTask).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Функция для фильтрации задач
  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      const matchesTitle = task.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesAssignee = task.assignee?.fullName.toLowerCase().includes(searchAssignee.toLowerCase()) ?? false;
      const matchesStatus = filterStatus === '' || task.status === filterStatus;
      const matchesBoard = filterBoard === '' || task.boardName === filterBoard;
      
      return matchesTitle && matchesAssignee && matchesStatus && matchesBoard;
    });
  };

  const filteredTasks = getFilteredTasks();

  if (isTasksLoading) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isTasksError) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Alert severity="error">
          {isTasksError ? 
            `Error loading tasks: ${tasksError?.toString()}` : 
            'Error loading boards'}
        </Alert>
      </Container>
    );
  }

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
            onChange={(e) => setFilterStatus(e.target.value as string)}
            label="Фильтр по статусу"
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
            onChange={(e) => setFilterBoard(e.target.value as string)}
            label="Фильтр по доске"
          >
            <MenuItem value="">Все</MenuItem>
            {boards?.map(({ name, id }) => (
              <MenuItem key={id} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <List>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <ListItem 
              key={task.id} 
              onClick={() => navigate(`/board/${task.id}`)}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <ListItemText 
                primary={task.title} 
                secondary={`Status: ${task.status} • Исполнитель: ${task.assignee?.fullName || 'не назначен'}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No tasks found" />
          </ListItem>
        )}
      </List>

      <TaskForm 
        open={open} 
        onClose={handleClose} 
        task={selectedTask} 
        onUpdateTask={handleUpdateTask} 
        isSubmitting={isUpdating}
      />
    </Container>
  );
};

export default IssuesPage;
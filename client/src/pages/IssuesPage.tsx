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
  Alert,
  Button
} from '@mui/material';
import TaskForm from '../components/TaskForm';
import { ITaskStatus } from '../types/task';
import { useGetBoardsQuery } from '../store/services/boards';
import { useModal } from 'mui-modal-provider';
import { useGetTasksWithBoards } from '../hooks/useGetTasksWithBoards';

const IssuesPage: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAssignee, setSearchAssignee] = useState('');
  const [filterStatus, setFilterStatus] = useState<ITaskStatus>(null);
  const [filterBoard, setFilterBoard] = useState('');

  const { data: boards = [] } = useGetBoardsQuery();
  const { 
    data: tasks, 
    isLoading: isTasksLoading, 
    isError: isTasksError 
  } = useGetTasksWithBoards();
console.log(tasks)
  const { showModal } = useModal();
  const handleOpenCreate = () => {
    showModal(TaskForm)
  };

  const filteredTasks = tasks?.filter(task => {
    const matchesTitle = task.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchesAssignee = task.assignee.fullName.toLowerCase().includes(searchAssignee.toLowerCase());
    const matchesStatus = filterStatus ? task.status === filterStatus : true;
    const matchesBoard = filterBoard ? task.boardName === filterBoard : true;
    
    return matchesTitle && matchesAssignee && matchesStatus && matchesBoard;
  }) || [];

  if (isTasksLoading) {
    return (
      <Container maxWidth="lg" sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isTasksError) {
    return (
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Alert severity="error">Ошибка загрузки задач</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Поиск по названию"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <TextField
          label="Поиск по исполнителю"
          value={searchAssignee}
          onChange={(e) => setSearchAssignee(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ITaskStatus)}
            label="Статус"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Доска</InputLabel>
          <Select
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
            label="Доска"
          >
            <MenuItem value="">Все</MenuItem>
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.name}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        {filteredTasks.map((task) => (
          <ListItem 
            key={task.id}
            onClick={() => {
              showModal(TaskForm, {task})
            }}
            sx={{
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemText
              primary={task.title}
              secondary={
                <>
                  <Box component="span" sx={{ mr: 2 }}>
                    Статус: {task.status}
                  </Box>
                  <Box component="span" sx={{ mr: 2 }}>
                    Исполнитель: {task.assignee.fullName}
                  </Box>
                  <Box component="span">
                    Проект: {task.boardName}
                  </Box>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'flex-end',
        position: 'sticky',
        bottom: 20,
        zIndex: 1
      }}>
        <Button 
          variant="contained" 
          onClick={handleOpenCreate}
          size="large"
          sx={{
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5
            }
          }}
        >
          Создать задачу
        </Button>
      </Box>
    </Container>
  );
};

export default IssuesPage;
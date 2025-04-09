import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoardsAsync } from '../redux/boards/boardsSlice';
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemText, Container, Box } from '@mui/material';
import { AppDispatch } from '../redux/store';

const BoardsPage: React.FC = () => {
  const boards = useSelector(selectBoards);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchBoardsAsync());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Все задачи</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit">Создать задачу</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flexGrow: 1, paddingTop: '20px' }}>
        <List sx={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
          {boards.map((board) => (
            <ListItem key={board.id} button sx={{ backgroundColor: '#fff', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <ListItemText primary={board.name} />
              <Button>Перейти к доске</Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default BoardsPage;
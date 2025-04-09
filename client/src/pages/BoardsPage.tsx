import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, fetchBoardsAsync } from '../redux/boards/boardsSlice';
import { Button, List, ListItem, ListItemText, Container, Box } from '@mui/material';
import { AppDispatch } from '../redux/store';

const BoardsPage: React.FC = () => {
  const boards = useSelector(selectBoards); // Получаем доски из стора
  const dispatch = useDispatch<AppDispatch>(); // Получаем dispatch для отправки действий
  React.useEffect(() => {
    dispatch(fetchBoardsAsync()); // Загружаем доски при монтировании компонента
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, paddingTop: '20px', width: '100%' }}>
        <List sx={{ width: '100%', padding: '20px' }}>
          {boards.map((board) => (
            <ListItem key={board.id}>
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
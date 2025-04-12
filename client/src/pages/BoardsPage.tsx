import React from 'react';
import { Button, List, ListItem, ListItemText, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetBoardsQuery } from '../store/services/tasks';

const BoardsPage: React.FC = () => {
  const { data: boards } = useGetBoardsQuery();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, paddingTop: '20px', width: '100%' }}>
        <List sx={{ width: '100%', padding: '20px' }}>
          {boards?.map((board) => (
            <ListItem key={board.id}>
              <ListItemText primary={board.name} />
              <Button href={`/board/${board.id}`} onClick={() => navigate(`/board/${board.id}`)}>Перейти к доске</Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default BoardsPage;
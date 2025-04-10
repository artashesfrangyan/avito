import React from 'react';
import { Button, List, ListItem, ListItemText, Container, Box } from '@mui/material';
import { useGetBoardsQuery } from '../store/services/boards';

const BoardsPage: React.FC = () => {
    const { data: boards } = useGetBoardsQuery();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1, paddingTop: '20px', width: '100%' }}>
        <List sx={{ width: '100%', padding: '20px' }}>
          {boards?.map((board) => (
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
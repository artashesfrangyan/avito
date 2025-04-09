import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC<{ onCreateTaskClick: () => void }> = ({ onCreateTaskClick }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Все задачи</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onCreateTaskClick} color="inherit">Создать задачу</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
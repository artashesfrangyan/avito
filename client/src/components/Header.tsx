import React from 'react';
import { AppBar, Toolbar, Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC<{ onCreateTaskClick: () => void }> = ({ onCreateTaskClick }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Link
            href="/issues"
            color="inherit"
            onClick={() => navigate('/issues')}
            style={{
                marginRight: '20px',
                fontSize: '18px',
                textDecoration: 'none',
                color: location.pathname === '/issues' ? 'red' : 'inherit',
            }}
            >
            Все задачи
            </Link>
        <Link
          href="/boards"
          color="inherit"
          onClick={() => navigate('/boards')}
          style={{
            fontSize: '18px',
            textDecoration: 'none',
            color: location.pathname.includes('/board') ? 'red' : 'inherit',
          }}
        >
          Проекты
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onCreateTaskClick} color="inherit">Создать задачу</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
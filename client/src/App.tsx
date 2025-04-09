import { Container } from '@mui/material';
import TaskBoard from './components/TaskBoard';

const App = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <TaskBoard />
    </Container>
  );
};

export default App;
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TaskBoard from './components/TaskBoard';
import { Container } from '@mui/material';

const App = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <TaskBoard />
      </Container>
    </Provider>
  );
};

export default App;
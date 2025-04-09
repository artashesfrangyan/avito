import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import Header from './components/Header';
import TaskForm from './components/TaskForm'
import { useState } from 'react';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <Header onCreateTaskClick={() => setOpen(true)} />
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
      </Routes>
      <TaskForm open={open} onClose={() => setOpen(false)} />
    </Router>
  );
};


export default App;
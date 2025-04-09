import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/boards" element={<BoardsPage />} />
      </Routes>
    </Router>
  );
};


export default App;
import { useEffect, useState } from 'react'
import './App.css'
import TaskList from './components/TaskList'
import { ITask } from './types/Task'

function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [statusFilter, setStatusFilter] = useState<ITask['status'] | 'All'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `/api/v1/tasks${statusFilter !== 'All' ? `?status=${statusFilter}` : ''}`
        );
        const data = await response.json();
        setTasks(data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [statusFilter]);

  const handleStatusChange = async (taskId: number, newStatus: ITask['status']) => {
    try {
      const response = await fetch(`/api/v1/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <>
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}

export default App

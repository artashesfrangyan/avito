import { AppThunk } from '../store';
import { ITask } from './types';
import { setLoading, setError, setTasks, updateTaskStatus } from './tasksSlice';

export const fetchTasks = (): AppThunk => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await fetch('http://localhost:8080/api/v1/tasks');
    const data = await response.json();
    dispatch(setTasks(data.data));
  } catch (err) {
    if (err instanceof Error) {
        dispatch(setError(err.message));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateTaskStatusThunk = (
  taskId: number,
  newStatus: ITask['status']
): AppThunk => async dispatch => {
  try {
    dispatch(setLoading(true));
    console.log(newStatus)
    const response = await fetch(`http://localhost:8080/api/v1/tasks/updateStatus/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Update failed');

    dispatch(updateTaskStatus({ taskId, newStatus }));
  } catch (err) {
    if (err instanceof Error) {
        dispatch(setError(err.message));
    }
  } finally {
    dispatch(setLoading(false));
  }
};
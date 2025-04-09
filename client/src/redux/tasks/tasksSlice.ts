import { createSlice } from '@reduxjs/toolkit';
import { createTaskAsync, fetchTasks, updateTaskAsync } from './tasksThunks';
import { ITask } from '../../types/task';

// Состояние задач
interface TasksState {
  tasks: ITask[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

// Редюсер для задач
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'; // Устанавливаем статус загрузки
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Устанавливаем статус успеха
        state.tasks = action.payload; // Устанавливаем список задач
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'; // Устанавливаем статус ошибки
        state.error = action.error.message ?? 'Something went wrong'; // Устанавливаем сообщение об ошибке
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload); // Добавляем новую задачу в список
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Обновляем задачу в списке
        }
      });
  },
});

// Селектор для получения списка задач
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;

export default tasksSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITask } from './types';

// Состояние задач
export interface TasksState {
  tasks: ITask[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

// Асинхронное действие для создания задачи
export const createTaskAsync = createAsyncThunk('tasks/createTask', async (task: ITask) => {
  const response = await axios.post('http://localhost:8080/api/v1/tasks/create', task); // Отправляем задачу на сервер
  return response.data;
});

// Редюсер для задач
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTaskAsync.pending, (state) => {
        state.status = 'loading'; // Устанавливаем статус загрузки
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Устанавливаем статус успеха
        state.tasks.push(action.payload); // Добавляем новую задачу в список
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.status = 'failed'; // Устанавливаем статус ошибки
        state.error = action.error.message ?? 'Something went wrong'; // Устанавливаем сообщение об ошибке
      });
  },
});

// Селектор для получения списка задач
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;

export default tasksSlice.reducer;
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITask } from '../../types/task';

// Асинхронное действие для получения задач
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get('http://localhost:8080/api/v1/tasks'); // Получаем задачи с сервера
  return response.data.data;
});

// Асинхронное действие для создания задачи
export const createTaskAsync = createAsyncThunk('tasks/createTask', async (task: ITask) => {
  const response = await axios.post('http://localhost:8080/api/v1/tasks/create', task); // Отправляем задачу на сервер
  return response.data;
});

// Асинхронное действие для обновления задачи
export const updateTaskAsync = createAsyncThunk('tasks/updateTask', async (task: ITask) => {
  const response = await axios.put(`http://localhost:8080/api/v1/tasks/${task.id}`, task); // Обновляем задачу на сервере
  return response.data;
});
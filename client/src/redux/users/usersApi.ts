import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронное действие для получения пользователей
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:8080/api/v1/users');
  return response.data.data;
});
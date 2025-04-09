import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../types/users';
import { fetchUsers } from './usersApi';

export interface UsersState {
  users: IUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'; // Устанавливаем статус загрузки
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Устанавливаем статус успеха
        state.users = action.payload; // Добавляем новую задачу в список
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'; // Устанавливаем статус ошибки
        state.error = action.error.message ?? 'Something went wrong'; // Устанавливаем сообщение об ошибке
      });
  },
});

// Селектор для получения списка пользователей
export const selectUsers = (state: { users: UsersState }) => state.users.users;

export default usersSlice.reducer;
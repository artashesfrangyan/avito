import { createSlice } from '@reduxjs/toolkit';
import { FormData } from '../../types/form';

// Начальное состояние
const initialState: FormData = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Backlog',
  assigneeId: 0,
  boardId: 0,
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    resetFormData: (state) => {
      state.title = '';
      state.description = '';
      state.priority = 'Medium';
      state.status = 'Backlog';
      state.assigneeId = 0;
      state.boardId = 0;
    },
    setFormData: (state, action) => {
      state.title = action.payload.title || state.title;
      state.description = action.payload.description || state.description;
      state.priority = action.payload.priority || state.priority;
      state.status = action.payload.status || state.status;
      state.assigneeId = action.payload.assigneeId || state.assigneeId;
      state.boardId = action.payload.boardId || state.boardId;
    },
  },
});

// Экшен для сброса данных формы
export const { resetFormData, setFormData } = formSlice.actions;

export default formSlice.reducer;
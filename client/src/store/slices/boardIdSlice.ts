import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Начальное состояние
const initialState = {
  boardId: 0
};

const boardIdSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardId: (state, action: PayloadAction<number>) => {
      state.boardId = action.payload;
    },
  },
});

export const { setBoardId } = boardIdSlice.actions;

// Для чтения boardId
export const selectBoardId = (state: RootState) => state.boardId;

export default boardIdSlice.reducer;
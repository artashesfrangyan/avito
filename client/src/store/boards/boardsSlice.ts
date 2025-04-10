import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoards } from './boardsApi';
import { IBoard } from '../../types/board';

export interface BoardsState {
  boards: IBoard[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  status: 'idle',
  error: null,
};

export const fetchBoardsAsync = createAsyncThunk('boards/fetchBoards', async () => {
  const boards = await fetchBoards();
  return boards;
});

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoardsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
 state.boards = action.payload;
      })
      .addCase(fetchBoardsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Something went wrong';
      });
  },
});

export const selectBoards = (state: { boards: BoardsState }) => state.boards.boards;

export default boardsSlice.reducer;
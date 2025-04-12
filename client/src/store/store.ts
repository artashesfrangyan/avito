import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { usersApi } from './services/users';
import { boardsApi } from './services/boards';
import { tasksApi } from './services/tasks';
import boardIdReducer from './slices/boardIdSlice';

export const store = configureStore({
  reducer: {
    boardId: boardIdReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [boardsApi.reducerPath]: boardsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(tasksApi.middleware, boardsApi.middleware, usersApi.middleware),
});

// Типы для работы с хранилищем
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
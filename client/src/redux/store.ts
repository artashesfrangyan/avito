import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import tasksReducer from './tasks/tasksSlice';
import boardsReducer from './boards/boardsSlice';
import usersReducer from './users/usersSlice';
import formReducer from './form/formSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Настройка persistReducer для кэширования в LocalStorage
const persistConfig = {
    key: 'root',
    storage,
};

const persistedFormReducer = persistReducer(persistConfig, formReducer);

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    boards: boardsReducer,
    users: usersReducer,
    form: persistedFormReducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

// Настройка persistStore
export const persistor = persistStore(store);

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
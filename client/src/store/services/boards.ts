import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBoard } from '../../types/board';

export const boardsApi = createApi({
  reducerPath: 'boardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
  tagTypes: ['Boards', 'Board'], // Для управления кэшем
  endpoints: (builder) => ({
    getBoards: builder.query<IBoard[], void>({
      query: () => '/boards',
      transformResponse: (response: { data: IBoard[] }) => response.data,
      providesTags: ['Boards'],
    }),
    getBoardTasks: builder.query<IBoard[], void>({
      query: (id) => `/boards/${id}`,
      providesTags: ['Board'],
    })
  }),
});

// Экспортируем автоматически сгенерированные хуки
export const { useGetBoardsQuery, useGetBoardTasksQuery } = boardsApi;
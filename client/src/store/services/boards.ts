import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBoard } from '../../types/board';
import { ITask } from '../../types/task';

export const boardsApi = createApi({
  reducerPath: 'boardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
  tagTypes: ['Boards', 'Board'],  // Теги для кэширования
  endpoints: (builder) => ({
    getBoards: builder.query<IBoard[], void>({
      query: () => '/boards',
      transformResponse: (response: { data: IBoard[] }) => response.data,
      providesTags: ['Boards'],
    }),
    
    getBoardTasks: builder.query<ITask[], string>({
      query: (id: string) => `/boards/${id}`,
      providesTags: ['Board'],
      transformResponse: (response: { data: ITask[] }) => response.data,
    })
  }),
});

export const { useGetBoardsQuery, useGetBoardTasksQuery } = boardsApi;
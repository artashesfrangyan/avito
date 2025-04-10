import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITask } from '../../types/task';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
  tagTypes: ['Tasks'], // Для управления кэшем
  endpoints: (builder) => ({
    // Получение списка задач
    getTasks: builder.query<ITask[], void>({
      query: () => '/tasks',
      transformResponse: (response: { data: ITask[] }) => response.data,
      providesTags: ['Tasks'],
    }),
    
    // Создание новой задачи
    createTask: builder.mutation<ITask, Partial<ITask>>({
      query: (task) => ({
        url: '/tasks/create',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'], // Обновляем список задач после создания
    }),
    
    // Обновление задачи
    updateTask: builder.mutation<ITask, ITask>({
      query: (task) => ({
        url: `/tasks/${task.id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Tasks'], // Обновляем список задач после изменения
    }),
  }),
});

// Экспортируем автоматически сгенерированные хуки
export const { 
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation 
} = tasksApi;
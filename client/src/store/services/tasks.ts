import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ITask, ITaskStatus } from '../../types/task';

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
    updateTask: builder.mutation<ITask, Partial<ITask>>({
      query: (task) => ({
        url: `/tasks/${task.id}`,
        method: 'PUT',
        body: {
          assigneeId: task.assigneeId, 
          description: task.description,
          priority: task.priority,
          status: task.status,
          title: task.title
        },
      }),
      invalidatesTags: ['Tasks'], // Обновляем список задач после изменения
    }),

    // Обновление статуса задачи
    updateTaskStatus: builder.mutation<ITask, IUpdateStatus>({
        query: ({id, status}) => ({
            url: `/tasks/updateStatus/${id}`,
            method: 'PUT',
            body: {"status": status},
        }),
        invalidatesTags: ['Tasks'], // Обновляем список задач после обновления
    }),
}),
});
interface IUpdateStatus {
  id: number
  status: ITaskStatus
}

// Экспортируем автоматически сгенерированные хуки
export const {
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
// usersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../../types/users';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
  tagTypes: ['Users'], // Для инвалидации кэша
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => '/users',
      transformResponse: (response: { data: IUser[] }) => response.data, // Трансформируем ответ, чтобы получить data
      providesTags: ['Users'], // Указываем, что этот endpoint предоставляет тег 'Users'
    }),
    // Можно добавить другие endpoints для создания/обновления пользователей
  }),
});

// Экспортируем автоматически сгенерированные хуки
export const { useGetUsersQuery } = usersApi;
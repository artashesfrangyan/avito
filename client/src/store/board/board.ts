// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { IBoard } from '../../types/board';

// const fetchBoard = createAsyncThunk('board/fetchBoard', async (boardId: number) => {
//   const response = await axios.get(`http://localhost:8080/api/v1/boards/${boardId}`); // Обновляем задачу на сервере
//   return response.data;
// });

// // Создаем API сервис для работы с досками
// export const boardsApi = createApi({
//   reducerPath: 'boardsApi',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Укажите ваш базовый URL
//   tagTypes: ['Board'], // Для инвалидации кэша
//   endpoints: (builder) => ({
//     getBoard: builder.query<IBoard, number>({
//       query: (boardId) => ({
//         url: `boards/${boardId}`,
//         method: 'GET',
//       }),
//       providesTags: (result, error, boardId) => [{ type: 'Board', id: boardId }],
//     })
//   }),
// });

// // Экспортируем автоматически сгенерированные хуки
// export const { useGetBoardQuery } = boardsApi;
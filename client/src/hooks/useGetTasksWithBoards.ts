import { useMemo } from "react";
import { useGetBoardsQuery } from "../store/services/boards";
import { useGetTasksQuery } from "../store/services/tasks";

export const useGetTasksWithBoards = () => {
  const { data: tasks, isLoading: tasksLoading, isError: tasksIsError } = useGetTasksQuery();
  const { data: boards, isLoading: boardsLoading, isError: boardsIsError } = useGetBoardsQuery();

  const boardMap = useMemo(() => {
    return boards?.reduce((acc, board) => {
      acc[board.name] = board.id;
      return acc;
    }, {} as Record<string, number>) || {};
  }, [boards]);

  const tasksWithBoards = useMemo(() => {
    return tasks?.map(task => ({
      ...task,
      boardId: boardMap[task.boardName] || task.boardId
    })) || [];
  }, [tasks, boardMap]);

  console.log(tasksWithBoards)
  return {
    data: tasksWithBoards,
    isLoading: tasksLoading || boardsLoading,
    isError: tasksIsError || boardsIsError,
    
  };
};
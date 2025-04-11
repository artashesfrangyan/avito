import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useUpdateTaskStatusMutation } from '../store/services/tasks';
import { ITask } from '../types/task';
import TaskColumn from '../components/TaskBoard/TaskColumn';
import { useGetBoardsQuery, useGetBoardTasksQuery } from '../store/services/boards';
import { useParams } from 'react-router-dom';
import { IBoard } from '../types/board';

const STATUSES: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
const COLUMN_NAMES = {
  Backlog: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done'
};

const TaskBoard = () => {
  const { id } = useParams<{id: string}>();

  const { data: boardsData } = useGetBoardsQuery();
  const { data: tasks = [], isLoading, isError } = useGetBoardTasksQuery(id || '');
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Находим текущую доску по id
  const currentBoard = useMemo(() => {
    return boardsData?.find((board: IBoard) => board.id === +id);
  }, [boardsData, id])

  // Маппинг статусов
  const statusMap = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks ? tasks.filter(task => task.status === status) : [];
      return acc;
    }, {} as Record<ITask['status'], ITask[]>);
  }, [tasks]);

  const handleDrop = useCallback(async (id: number, newStatus: ITask['status']) => {
    try {
      await updateTaskStatus({ id, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }, [updateTaskStatus]);

  if (isLoading) return <div>Загрузка задач...</div>;
  if (isError) return <div>Ошибка при загрузке задач</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      {currentBoard && (
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          mt: 3,
          ml: 3,
          mb: 3,
          fontWeight: 'bold'
        }}>
          {currentBoard.name}
        </Typography>
      )}
      <Grid container spacing={3} sx={{ p: 3, minHeight: '80vh', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {STATUSES.map((status) => (
          <Grid size={{ xs: 12, md: 4 }} key={status}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px',
                }}>
                  {COLUMN_NAMES[status]}
                </Typography>
                <TaskColumn status={status} tasks={statusMap[status]} onDrop={handleDrop} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
};

export default TaskBoard;
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '../store/services/tasks';
import { ITask } from '../types/task';
import TaskColumn from '../components/TaskBoard/TaskColumn';
import { useGetTasksWithBoards } from '../hooks/useGetTasksWithBoards';

const STATUSES: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
const COLUMN_NAMES = {
  Backlog: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done'
};

const TaskBoard = () => {
  const { data: tasks = [], isLoading, isError } = useGetTasksWithBoards();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const tasksByStatus = useCallback(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter(task => task.status === status);
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
                  {status && COLUMN_NAMES[status]}
                </Typography>
                <TaskColumn status={status} tasks={tasksByStatus()[status]} onDrop={handleDrop} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
};

export default TaskBoard;
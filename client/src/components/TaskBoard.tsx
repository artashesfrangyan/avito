import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchTasks, updateTaskStatusThunk } from '../redux/tasks/tasksThunks';
import TaskItem from './TaskItem';
import { ITask } from '../redux/tasks/types';

const STATUSES: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
const COLUMN_NAMES = {
  Backlog: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done'
};

const TaskBoard = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector(state => state.tasks);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.data.current?.status as ITask['status'];
    
    dispatch(updateTaskStatusThunk(Number(taskId), newStatus));
  };

  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = [...(acc[task.status] || []), task];
    return acc;
  }, {} as Record<ITask['status'], ITask[]>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        setActiveTask(tasks.find(task => task.id === active.id) || null);
      }}
    >
      <Grid container spacing={3} sx={{ p: 3, minHeight: '80vh' }}>
        {STATUSES.map(status => (
          <Grid item xs={12} md={4} key={status}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  mb: 2,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px'
                }}>
                  {COLUMN_NAMES[status]}
                </Typography>
                
                <Box sx={{ 
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  minHeight: 200,
                  p: 1
                }}>
                  <SortableContext 
                    items={tasksByStatus[status] || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {(tasksByStatus[status] || []).map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}

                    {!tasksByStatus[status]?.length && (
                      <Box sx={{
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.disabled'
                      }}>
                        No tasks in this column
                      </Box>
                    )}
                  </SortableContext>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DragOverlay>
        {activeTask && <TaskItem task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
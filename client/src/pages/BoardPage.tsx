import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useCallback } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskItem from '../components/TaskItem';
import { ITask } from '../types/task';
import { 
  useGetTasksQuery, 
  useUpdateTaskStatusMutation 
} from '../store/services/tasks';

// Константы статусов задач
const STATUSES: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
const COLUMN_NAMES = {
  Backlog: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done'
};

// Тип для drag-and-drop
const ItemTypes = {
  TASK: 'task'
};

/**
 * Компонент карточки задачи с возможностью перетаскивания
 */
const DraggableTaskItem = ({ task, onDrop }: { task: ITask; onDrop: (id: number, status: ITask['status']) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: '8px'
      }}
    >
      <TaskItem task={task} />
    </div>
  );
};

/**
 * Компонент колонки, принимающей перетаскиваемые задачи
 */
const TaskColumn = ({ status, tasks, onDrop }: { 
  status: ITask['status']; 
  tasks: ITask[]; 
  onDrop: (id: number, status: ITask['status']) => void 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: number }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      style={{
        backgroundColor: isOver ? '#f5f5f5' : 'inherit',
        minHeight: '200px',
        borderRadius: '4px',
        padding: '8px',
        transition: 'background-color 0.2s ease'
      }}
    >
      {tasks.map((task) => (
        <DraggableTaskItem key={task.id} task={task} onDrop={onDrop} />
      ))}
      {tasks.length === 0 && (
        <Box 
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled'
          }}
        >
          No tasks in this column
        </Box>
      )}
    </div>
  );
};

/**
 * Компонент доски задач с drag-and-drop функциональностью
 */
const TaskBoard = () => {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Группировка задач по статусам
  const tasksByStatus = useCallback(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter(task => task.status === status);
      return acc;
    }, {} as Record<ITask['status'], ITask[]>);
  }, [tasks]);

  // Обработчик перемещения задачи
  const handleDrop = useCallback(async (id: number, newStatus: ITask['status']) => {
    try {
      await updateTaskStatus({
        id: Number(id),
        status: newStatus
      }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }, [updateTaskStatus]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          p: 3, 
          minHeight: '80vh', 
          flexWrap: 'nowrap',
          overflowX: 'auto'
        }}
      >
        {STATUSES.map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: 300
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: 2,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {COLUMN_NAMES[status]}
                </Typography>
                
                <TaskColumn 
                  status={status} 
                  tasks={tasksByStatus()[status]} 
                  onDrop={handleDrop} 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
};

export default TaskBoard;
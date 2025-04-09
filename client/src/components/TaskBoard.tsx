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
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { ITask } from '../types/task';
  
  const statuses: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
  
  const TaskBoard = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [activeTask, setActiveTask] = useState<ITask | null>(null);
    
    // Инициализация сенсоров для DnD
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  
    // Загрузка задач
    useEffect(() => {
      const fetchTasks = async () => {
        const response = await fetch('/api/v1/tasks');
        const data = await response.json();
        setTasks(data.data);
      };
      fetchTasks();
    }, []);
  
    // Обработка завершения перетаскивания
    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
  
      const taskId = active.id;
      const newStatus = over.data.current?.status as ITask['status'];
  
      try {
        // Обновление статуса на бэкенде
        const response = await fetch(`/api/v1/tasks/updateStatus/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify({ status: newStatus }),
        });
        
        const updatedTask = await response.json();
        
        // Обновление локального состояния
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
      } catch (error) {
        console.error('Ошибка при изменении статуса:', error);
      }
    };
  
    // Группировка задач по статусам
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
        <Grid container spacing={3} sx={{ p: 3 }}>
          {statuses.map(status => (
            <Grid item xs={4} key={status}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {status}
                  </Typography>
                  
                  <SortableContext 
                    items={tasksByStatus[status] || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {(tasksByStatus[status] || []).map(task => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </SortableContext>
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
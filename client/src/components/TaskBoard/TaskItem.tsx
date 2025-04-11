import { Card, CardContent, Typography, Chip, Stack, useTheme } from '@mui/material';
import { ITask } from '../../types/task';
import { useModal } from 'mui-modal-provider';
import TaskForm from '../TaskForm';

interface TaskItemProps {
  task: ITask;
  isDragging?: boolean;
}

// Цвета чипов по приоритетам
const priorityColors = {
  Low: 'success',
  Medium: 'warning',
  High: 'error'
} as const;

const TaskItem = ({ task, isDragging = false }: TaskItemProps) => {
  const { showModal } = useModal();
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: theme.shadows[3] },
        ...(isDragging && {
          boxShadow: theme.shadows[6],
          transform: 'scale(1.02)',
          transition: 'all 0.2s ease'
        })
      }}
      onClick={() => showModal(TaskForm, {task})}
    >
      <CardContent>
        <Typography variant="subtitle1" noWrap gutterBottom>
          {task.title}
        </Typography>
        
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              overflow: 'hidden'
            }}
          >
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} mt={1}>
          <Chip 
            label={task.priority} 
            color={priorityColors[task.priority]} 
            size="small" 
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
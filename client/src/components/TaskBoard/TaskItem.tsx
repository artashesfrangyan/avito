import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { ITask } from '../../types/task';
import { useCallback } from 'react';

const TaskItem = ({ task, isDragging = false }: { 
  task: ITask;
  isDragging?: boolean;
}) => {

  const priorityColors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error'
  } as const;

  // const onClick = useCallback(() => {

  // }, [])

  return (
    <Card
      sx={{
        '&:hover': {
          boxShadow: 3,
        },
        ...(isDragging && {
          boxShadow: 6,
          transform: 'scale(1.02)',
        }),
      }}
      // onClick={onClick}
    >
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>
        <Stack direction="row" spacing={1}>
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
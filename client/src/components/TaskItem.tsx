import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { ITask } from '../types/task';

const TaskItem = ({ task, isDragging = false }: { 
  task: ITask;
  isDragging?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginBottom: 2,
  };

  const priorityColors = {
    Low: 'success',
    Medium: 'warning',
    High: 'error'
  } as const;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        '&:hover': {
          boxShadow: 3,
        },
        ...(isDragging && {
          boxShadow: 6,
          transform: 'scale(1.02)',
        }),
      }}
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
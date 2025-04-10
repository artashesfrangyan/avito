import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import DraggableTaskItem from './DraggableTaskItem';
import { ITask } from '../../types/task';

const TaskColumn = ({ status, tasks, onDrop }: { 
  status: ITask['status']; 
  tasks: ITask[]; 
  onDrop: (id: number, status: ITask['status']) => void 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box 
      ref={drop}
      sx={{
          height: '100%',
        backgroundColor: isOver ? '#f5f5f5' : 'inherit',
        minHeight: '200px',
        borderRadius: '4px',
        padding: '8px',
        transition: 'background-color 0.2s ease',
      }}
    >
      {tasks.map((task) => (
        <DraggableTaskItem key={task.id} task={task} />
      ))}
      {tasks.length === 0 && (
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
    </Box>
  );
};

export default TaskColumn;
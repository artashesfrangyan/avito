import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import DraggableTaskItem from './DraggableTaskItem';
import { ITask } from '../../types/task';
import { useRef } from 'react';

interface TaskColumnProps {
  status: ITask['status'];
  tasks: ITask[];
  onDrop: (id: number, status: ITask['status']) => void;
}

const TaskColumn = ({ status, tasks, onDrop }: TaskColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const columnStyles = {
    height: '100%',
    backgroundColor: isOver ? '#f5f5f5' : 'inherit',
    minHeight: '200px',
    borderRadius: '4px',
    padding: '8px',
    transition: 'background-color 0.2s ease',
  };

  const emptyStateStyles = {
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.disabled'
  };

  drop(ref);

  return (
    <Box ref={ref} sx={columnStyles}>
      {tasks.map((task) => (
        <DraggableTaskItem key={task.id} task={task} />
      ))}
      
      {tasks.length === 0 && (
        <Box sx={emptyStateStyles}>
          В этой колонке нет задач
        </Box>
      )}
    </Box>
  );
};

export default TaskColumn;
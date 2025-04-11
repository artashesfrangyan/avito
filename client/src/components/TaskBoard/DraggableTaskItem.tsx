import { useDrag } from 'react-dnd';
import TaskItem from './TaskItem';
import { ITask } from '../../types/task';
import { useRef } from 'react';

const DraggableTaskItem = ({ task }: { task: ITask }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Связываем ref с drag
  drag(ref);

  return (
    <div 
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '8px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <TaskItem task={task} />
    </div>
  );
};

export default DraggableTaskItem;
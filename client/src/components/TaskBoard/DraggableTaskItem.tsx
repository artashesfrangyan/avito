import { useDrag } from 'react-dnd';
import TaskItem from './TaskItem';
import { ITask } from '../../types/task';

const DraggableTaskItem = ({ task }: { task: ITask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
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

export default DraggableTaskItem;
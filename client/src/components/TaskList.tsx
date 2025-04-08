import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Chip,
    Stack,
    Typography,
    Skeleton
} from '@mui/material';
import { ITask } from '../types/Task';

interface ITaskListProps {
    tasks: ITask[];
    loading?: boolean;
    onStatusChange: (taskId: number, newStatus: ITask['status']) => void;
}

const TaskList = ({ tasks, loading, onStatusChange }: ITaskListProps) => {
    return (
        <Stack spacing={2}>
            {loading ? (
                [1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" />
                            <Stack direction="row" spacing={1} mt={2}>
                                <Skeleton variant="rectangular" width={80} height={24} />
                                <Skeleton variant="rectangular" width={80} height={24} />
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            ) : (
                tasks.map((task) => (
                    <Card key={task.id}>
                        <CardHeader
                            avatar={
                                <Avatar src={task.assignee.avatarUrl}>
                                    {task.assignee.fullName[0]}
                                </Avatar>
                            }
                            title={task.assignee.fullName}
                            subheader={task.boardName}
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {task.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {task.description}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    variant="outlined"
                                />
                                <Chip
                                    onClick={() => {
                                        const newStatus = prompt('Enter new status', task.status);
                                        if (newStatus) onStatusChange(task.id, newStatus as ITask['status']);
                                    }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                ))
            )}
        </Stack>
    );
};

export default TaskList;
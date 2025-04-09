export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
  assignee: {
    id: number;
    fullName: string;
    avatarUrl: string;
  };
  boardName: string;
}
  
export interface TasksState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}
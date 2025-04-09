interface IAssignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export type ITaskStatus = 'Backlog' | 'InProgress' | 'Done';
export type ITaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: ITaskStatus;
  status: ITaskPriority;
  assignee: IAssignee;
  boardName: string;
}
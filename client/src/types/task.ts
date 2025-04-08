interface IAssignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export type TTaskStatus = 'Backlog' | 'InProgress' | 'Done';
export type TTaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: TTaskPriority;
  status: TTaskStatus;
  assignee: IAssignee;
  boardName: string;
}
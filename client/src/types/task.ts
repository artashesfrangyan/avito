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
  priority: ITaskPriority;
  status: ITaskStatus;
  assignee: IAssignee;
  boardName: string;
  boardId: number;
  assigneeId: number;
}
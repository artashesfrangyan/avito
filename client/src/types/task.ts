interface IAssignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export type ITaskStatus = 'Backlog' | 'InProgress' | 'Done' | null;
export type ITaskPriority = 'Low' | 'Medium' | 'High' | null;

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: ITaskPriority;
  status: ITaskStatus;
  assignee: IAssignee;
  boardName: string;
  board?: {
    id: number;
    name: string;
  }
}
// Интерфейс исполнителя
export interface IUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  description?: string,
  tasksCount?: 0,
  teamId?: 0,
  teamName?: string
}
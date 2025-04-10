import { ITaskPriority, ITaskStatus } from "./task";

// Интерфейс данных формы
export interface IFormData {
    title: string;
    description: string;
    priority: ITaskPriority;
    status: ITaskStatus;
    assigneeId: number | null;
    boardId: number | null;
}
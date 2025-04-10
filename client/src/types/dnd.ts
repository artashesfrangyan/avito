import { ITask } from "./task";

export type DropResult = {
    id: number;
    status: ITask['status'];
};

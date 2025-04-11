export interface IBoard {
    id: number;
    name: string;
    description: string;
    taskCount: number;
}

export interface IBoardContext {
    boardId: number;
    setBoardId: (id: number) => void;
};
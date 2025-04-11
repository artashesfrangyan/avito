import { createContext, ReactNode, useState } from "react";
import { IBoardContext } from "../types/board";

export const BoardContext = createContext<IBoardContext | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boardId, setBoardId] = useState(0);
  return (
    <BoardContext.Provider value={{ boardId, setBoardId }}>
      {children}
    </BoardContext.Provider>
  );
};
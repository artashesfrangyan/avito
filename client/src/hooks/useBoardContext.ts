import { useContext } from "react";
import { BoardContext } from "../context/BoardContext";

// Кастомный хук для доступа к контексту доски
export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
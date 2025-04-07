// checks if a selected piece can be placed
// on a square. If the piece can be placed
// on that square, then the square becomes highlighted

import { IValiPieceMoves } from "@/types/play";

function isSquareAllowed(moves: IValiPieceMoves[], square: string): boolean {
  const check = (move: IValiPieceMoves) => move.to === square; // can the piece land on the square?

  return moves.some(check);
}

export { isSquareAllowed };

"use client";

// Representation of the chess board
import { Board, Pieces, IValiPieceMoves } from "@/types/play";
import { SQUARES, Color } from "chess.js";
import { isSquareAllowed } from "@/lib/isSquareAllowed";

interface IBoard {
  board: (Board | null)[][];
  handleBoardClick: (e) => void;
  validPieceMoves: IValiPieceMoves[];
  selectedSquarePosition: string | undefined;
  selectedPiecePosition: string;
  isInCheck: boolean;
  turn: Color;
}

export default function ChessBoard({
  board,
  handleBoardClick,
  validPieceMoves,
  selectedSquarePosition,
  selectedPiecePosition,
  isInCheck,
  turn,
}: IBoard) {
  console.log(validPieceMoves);
  console.log(board);
  return (
    <>
      <div className="cursor-pointer absolute translate-x-0 -translate-y-1/2 top-1/2 w-full flex items-center justify-center">
        <div
          onClick={(e) => handleBoardClick(e)}
          className="w-[576px] h-[576px]"
        >
          {board.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="w-[576px] h-[72px] flex">
                {row.map((tile, colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      data-square={SQUARES[rowIndex * 8 + colIndex]}
                      className={`${(rowIndex + colIndex) % 2 == 0 ? "bg-amber-200" : "bg-amber-700"} ${selectedPiecePosition == SQUARES[rowIndex * 8 + colIndex] ? "bg-amber-800/75" : ""} relative size-18 flex items-center justify-center`}
                    >
                      {tile !== null && (
                        <img
                          className={`${selectedSquarePosition !== undefined && selectedSquarePosition == SQUARES[rowIndex * 8 + colIndex] ? "bg-amber-400/90" : ""} ${isInCheck && tile.type == "k" && tile.color == turn ? "bg-red-500" : ""}`}
                          src={Pieces[tile.type][tile.color]}
                          data-square={tile.square}
                        />
                      )}
                      {isSquareAllowed(
                        validPieceMoves,
                        SQUARES[rowIndex * 8 + colIndex]
                      ) && (
                        <span
                          data-square={SQUARES[rowIndex * 8 + colIndex]}
                          className="rounded-full bg-black/75 size-6 absolute top-1/2 translate-x-0 -translate-y-1/2"
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

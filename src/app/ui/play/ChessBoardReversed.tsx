// reversed chessboard (from black's point of view)

"use client";

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

type BoardType = (Board | null)[][];

export default function ChessBoardReversed({
  board,
  handleBoardClick,
  validPieceMoves,
  selectedSquarePosition,
  selectedPiecePosition,
  isInCheck,
  turn,
}: IBoard) {
  const reversedBoard: BoardType = new Array(8)
    .fill(null)
    .map(() => new Array(8).fill(null));

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      reversedBoard[i][j] = board[7 - i][7 - j];
    }
  }

  return (
    <>
      <div className="cursor-pointer  w-full flex items-center justify-center">
        <div
          onClick={(e) => handleBoardClick(e)}
          className="w-[192px] h-[192px] md:w-[384px] md:h-[384px] lg:w-[512px] lg:h-[512px] 2xl:w-[576px] 2xl:h-[576px]"
        >
          {reversedBoard.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className="w-[192px] h-[24px] md:w-[384px] md:h-[48px] lg:w-[512px] lg:h-[64px] 2xl:w-[576px] 2xl:h-[72px] flex"
              >
                {row.map((tile, colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      data-square={SQUARES[63 - rowIndex * 8 - colIndex]}
                      className={`${(rowIndex + colIndex) % 2 == 0 ? "bg-amber-200" : "bg-amber-700"} ${selectedPiecePosition == SQUARES[rowIndex * 8 + colIndex] ? "bg-amber-800/75" : ""} ${rowIndex == 0 ? "first:rounded-tl-lg last:rounded-tr-lg" : ""} ${rowIndex == 7 ? "first:rounded-bl-lg last:rounded-br-lg" : ""}  relative size-6 md:size-12  lg:size-16 2xl:size-18 flex items-center justify-center`}
                    >
                      {tile !== null && (
                        <img
                          className={`${selectedSquarePosition !== undefined && selectedSquarePosition == SQUARES[63 - rowIndex * 8 - colIndex] ? "bg-amber-400/90" : ""} ${isInCheck && tile.type == "k" && tile.color == turn ? "bg-red-500" : ""}`}
                          src={Pieces[tile.type][tile.color]}
                          data-square={tile.square}
                        />
                      )}
                      {isSquareAllowed(
                        validPieceMoves,
                        SQUARES[63 - rowIndex * 8 - colIndex]
                      ) && (
                        <span
                          data-square={SQUARES[63 - rowIndex * 8 - colIndex]}
                          className="rounded-full bg-black/75 size-2  md:size-4 lg:size-5 2xl:size-6 absolute top-1/2 translate-x-0 -translate-y-1/2"
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

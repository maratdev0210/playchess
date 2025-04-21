"use client";

// Representation of the chess board
import {
  Board,
  Pieces,
  IValiPieceMoves,
  coordinates,
  ranks,
} from "@/types/play";
import { SQUARES, Color } from "chess.js";

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
  return (
    <>
      <div className="cursor-pointer  w-full flex items-center justify-center">
        <div
          onClick={(e) => handleBoardClick(e)}
          className="w-[192px] h-[192px] md:w-[384px] md:h-[384px] lg:w-[512px] lg:h-[512px] 2xl:w-[576px] 2xl:h-[576px]"
        >
          {board.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className="w-[192px] h-[24px] md:w-[384px] md:h-[48px] lg:w-[512px] lg:h-[64px] 2xl:w-[576px] 2xl:h-[72px] flex"
              >
                {row.map((tile, colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      data-square={SQUARES[rowIndex * 8 + colIndex]}
                      className={`${(rowIndex + colIndex) % 2 == 0 ? "bg-boardWhite" : "bg-boardBlack"} ${selectedPiecePosition == SQUARES[rowIndex * 8 + colIndex] ? "bg-amber-800/75" : ""} ${rowIndex == 0 ? "first:rounded-tl-lg last:rounded-tr-lg" : ""} ${rowIndex == 7 ? "first:rounded-bl-lg last:rounded-br-lg" : ""}  relative size-6 md:size-12  lg:size-16 2xl:size-18 flex items-center justify-center`}
                    >
                      {tile !== null && (
                        <img
                          className={`${selectedSquarePosition !== undefined && selectedSquarePosition == SQUARES[rowIndex * 8 + colIndex] ? "bg-yellow-200" : ""} ${isInCheck && tile.type == "k" && tile.color == turn ? "bg-red-500" : ""}`}
                          src={Pieces[tile.type][tile.color]}
                          data-square={tile.square}
                        />
                      )}
                      {colIndex == 0 && (
                        <div className="absolute translate-y-0 translate-x-1/2 left-0 top-0 mt-0.5">
                          <span
                            className={`${(rowIndex + colIndex) % 2 == 0 ? "text-boardBlack" : "text-boardWhite"} font-bold text-sm`}
                          >
                            {ranks[rowIndex]}
                          </span>
                        </div>
                      )}
                      {rowIndex == 7 && (
                        <div
                          className={`right-0 mr-0.5 absolute translate-x-0 translate-y-full`}
                        >
                          <span
                            className={`${(rowIndex + colIndex) % 2 == 0 ? "text-boardBlack" : "text-boardWhite"} font-bold text-sm`}
                          >
                            {coordinates[colIndex]}
                          </span>
                        </div>
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

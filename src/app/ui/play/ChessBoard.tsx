// Representation of the chess board
import { Board, Pieces } from "@/types/play";
import { SQUARES } from "chess.js";

interface IBoard {
  board: (Board | null)[][];
}

export default function ChessBoard({ board }: IBoard) {
  console.log(board);
  console.log(SQUARES);

  return (
    <>
      <div className="cursor-pointer absolute translate-x-0 -translate-y-1/2 top-1/2 w-full flex items-center justify-center">
        <div className="w-[576px] h-[576px]">
          {board.map((row, rowIndex) => {
            console.log(row);
            return (
              <div key={rowIndex} className="w-[576px] h-[72px] flex">
                {row.map((tile, colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      data-square={SQUARES[rowIndex * 8 + colIndex]}
                      className={`${(rowIndex + colIndex) % 2 == 0 ? "bg-amber-200" : "bg-amber-700"} size-18 flex items-center justify-center`}
                    >
                      {tile !== null && (
                        <img src={Pieces[tile.type][tile.color]} />
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

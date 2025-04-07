import { Move } from "chess.js";
import { PIECEICONS } from "@/types/play";

interface IHistory {
  history: Move[];
  activeMove: number | undefined; // currently selected move by the player defaults to the length of history
  setActiveMove: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface IShowMove {
  history: Move[];
  index: number;
  activeMove: number | undefined;
  setActiveMove: React.Dispatch<React.SetStateAction<number | undefined>>;
}

function ShowMove({ history, index, activeMove, setActiveMove }: IShowMove) {
  return (
    <div
      data-move={index}
      onClick={() => setActiveMove(index)}
      className={`flex-1 text-lg hover:bg-blue-100 hover:transition hover:duration-300 ${activeMove === index ? "bg-blue-200 text-gray-700" : ""}`}
    >
      {history[index].piece !== "p" && (
        <span>{PIECEICONS[history[index].piece][history[index].color]}</span>
      )}
      <span className="px-1 inline-block">{history[index].san}</span>
    </div>
  );
}

export default function ShowMoves({
  history,
  activeMove,
  setActiveMove,
}: IHistory) {
  console.log(history);
  return (
    <>
      {history.map((move, index) => {
        if (index % 2 == 0 && index + 1 == history.length) {
          return (
            <div key={index} className="flex m-0">
              <div className="flex-1 text-gray-700 text-lg text-center bg-gray-100 ">
                {Math.floor((index + 1) / 2) + 1}
              </div>
              <div className="flex-6 items-center flex *:cursor-pointer">
                <ShowMove
                  history={history}
                  index={index}
                  activeMove={activeMove}
                  setActiveMove={setActiveMove}
                />
                <div className="flex-1"></div>
              </div>
            </div>
          );
        }
        if (index % 2 == 1) {
          return (
            <div key={index} className="flex m-0">
              <div className="flex-1 text-gray-700 text-lg text-center bg-gray-100 ">
                {Math.floor((index + 1) / 2)}
              </div>
              <div className="flex-6 items-center flex *:cursor-pointer">
                <ShowMove
                  history={history}
                  index={index - 1}
                  activeMove={activeMove}
                  setActiveMove={setActiveMove}
                />
                <ShowMove
                  history={history}
                  index={index}
                  activeMove={activeMove}
                  setActiveMove={setActiveMove}
                />
              </div>
            </div>
          );
        }
      })}
    </>
  );
}

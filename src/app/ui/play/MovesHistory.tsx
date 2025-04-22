// display the moves history on a sidebar

import { Rewind, SkipForward, Repeat2, Flag } from "lucide-react";
import ShowMoves from "@/app/widgets/play/ShowMoves";
import { Move } from "chess.js";
import Link from "next/link";
import React from "react";
import Clock from "./Clock";
import OpponentClock from "./OpponentClock";

interface IMovesHistory {
  gameId: string;
  history: Move[];
  activeMove: number | undefined;
  setActiveMove: React.Dispatch<React.SetStateAction<number | undefined>>;
  opponent: string; // opponent's username of a player
  player: string;
  boardView: string;
  setBoardView: React.Dispatch<React.SetStateAction<string>>;
  setGameActionType: React.Dispatch<React.SetStateAction<string>>; // choose the option to resign or offer the draw
  playerRating: number;
  opponentRating: number;
  side: string;
  playerSide: string | null;
  opponentSide: string | null;
}

export default function MovesHistory({
  gameId,
  history,
  activeMove,
  setActiveMove,
  opponent,
  player,
  boardView,
  setBoardView,
  setGameActionType,
  playerRating,
  opponentRating,
  side,
  playerSide,
  opponentSide,
}: IMovesHistory) {
  return (
    <>
      <div>
        <OpponentClock
          gameId={gameId}
          opponentSide={opponentSide}
          side={side}
        />
      </div>

      <div className="w-60 py-2 md:h-90 md:w-90 border-1 border-none history rounded-lg">
        <div className="pb-2 px-4">
          <div className="flex flex-col">
            <Link href={`/arena/${opponent}`}>
              <span className="text-gray-700 text-lg">{opponent}</span>
            </Link>
            <span className="inline-block mt-1 text-gray-500">
              {opponentRating}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-12 h-12 cursor-pointer bg-gray-100 *:hover:transition *:hover:duration-300 *:hover:text-gray-700 *:hover:scale-125">
          <div>
            <Rewind className=" text-gray-600" />
          </div>
          <div>
            <SkipForward className="rotate-180 text-gray-600 size-5" />
          </div>
          <div>
            <SkipForward className="text-gray-600 size-5" />
          </div>
          <div>
            <Rewind className="rotate-180 text-gray-600" />
          </div>
        </div>
        <div className="w-full h-40 overflow-y-auto">
          <ShowMoves
            history={history}
            activeMove={activeMove}
            setActiveMove={setActiveMove}
          />
        </div>
        <div className="pb-2 px-4 flex justify-between gap-2">
          <div className="flex flex-col">
            <Link href={`/arena/${player}`}>
              <span className="text-gray-700 text-lg">{player}</span>
            </Link>
            <span className="inline-block mt-1 text-gray-500">
              {playerRating}
            </span>
          </div>

          <div className="flex gap-1">
            <div title="flip the board">
              <Repeat2
                onClick={() =>
                  setBoardView(boardView === "black" ? "white" : "black")
                }
                className="text-gray-500 cursor-pointer hover:transition hover:duration-300 hover:scale-105"
              />
            </div>
            <div title="Resign">
              <Flag
                onClick={() => setGameActionType("resign")}
                className="text-gray-500 cursor-pointer scale-80 hover:transition hover:duration hover:scale-90"
              />
            </div>
            <div title="Offer draw" onClick={() => setGameActionType("draw")}>
              <span className="cursor-pointer hover:transition hover:duration-300 hover:scale-105 relative bottom-0.5 font-semibold inline-block text-gray-500">
                1
              </span>
              <span className="cursor-pointer text-gray-500 font-semibold hover:transition hover:duration-300 hover:scale-105 inline-block">
                /
              </span>
              <span className="cursor-pointer relative top-0.5 font-semibold text-gray-500 hover:transition hover:duration-300 hover:scale-105 inline-block">
                2
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Clock gameId={gameId} playerSide={playerSide} side={side} />
      </div>
    </>
  );
}

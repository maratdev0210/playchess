// display the moves history on a sidebar

import { Rewind, SkipForward } from "lucide-react";
import ShowMoves from "@/app/widgets/play/ShowMoves";
import { Move } from "chess.js";

interface IMovesHistory {
  history: Move[];
  activeMove: number | undefined;
  setActiveMove: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function MovesHistory({
  history,
  activeMove,
  setActiveMove,
}: IMovesHistory) {
  return (
    <>
      <div className="h-40 w-60 py-2 md:h-75 md:w-90 border-1 border-none history rounded-lg">
        <div className="pb-2 px-4">
          {/* opponents's username */}
          <span className="text-gray-700 text-lg">marat2005</span>
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
      </div>
    </>
  );
}

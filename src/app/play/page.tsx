import { DEFAULT_POSITION } from "@/types/play";
import { Chess } from "chess.js";
import ChessBoard from "../ui/play/ChessBoard";

export default function Page() {
  const chess = new Chess(DEFAULT_POSITION, { skipValidation: false });
  return (
    <>
      <div>Play Game</div>
      <ChessBoard board={chess.board()} />
    </>
  );
}

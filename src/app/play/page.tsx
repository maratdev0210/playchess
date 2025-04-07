"use client";

import { DEFAULT_POSITION, IValiPieceMoves, IPiece, Board } from "@/types/play";
import { Chess } from "chess.js";
import ChessBoard from "../ui/play/ChessBoard";
import { useState } from "react";

type IBoard = (Board | null)[][];
const chess = new Chess(DEFAULT_POSITION, { skipValidation: false });

export default function Page() {
  const [validPieceMoves, setValidPieceMoves] = useState<IValiPieceMoves[]>([]);
  const [selectedSquarePosition, setSelectedSquarePosition] = useState<
    string | undefined
  >(); 
  const [selectedPiece, setSelectedPiece] = useState<IPiece | undefined>();
  const [board, setBoard] = useState<IBoard>(chess.board());
  const [selectedPiecePosition, setSelectedPiecePosition] =
    useState<string>("");

  const handleBoardClick = (event) => {
    setSelectedSquarePosition(event.target.dataset.square);
    setValidPieceMoves(
      chess.moves({ square: event.target.dataset.square, verbose: true })
    );
    // put a piece on a square if the piece had already been selected before
    if (selectedPiece !== undefined && selectedPiecePosition !== "") {
      if (chess.turn() == selectedPiece.color) {
        chess.move({
          from: selectedPiecePosition,
          to: event.target.dataset.square,
        });
      }
      setBoard(chess.board());
      setSelectedPiece(undefined);
      setSelectedPiecePosition("");
    }
    if (selectedPiece === undefined) {
      setSelectedPiece(chess.get(event.target.dataset.square));
      setSelectedPiecePosition(event.target.dataset.square);
    }
  };

  return (
    <>
      <div>Play Game</div>
      <ChessBoard
        board={board}
        handleBoardClick={handleBoardClick}
        validPieceMoves={validPieceMoves}
        selectedSquarePosition={selectedSquarePosition}
      />
    </>
  );
}

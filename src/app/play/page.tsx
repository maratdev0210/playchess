"use client";

import {
  DEFAULT_POSITION,
  IValiPieceMoves,
  IPiece,
  Board,
  GameState,
} from "@/types/play";
import { Chess } from "chess.js";
import ChessBoard from "../ui/play/ChessBoard";
import GameEndAlert from "../ui/play/GameEndAlert";
import { useState, useEffect, useRef } from "react";
import { SOUNDS } from "@/types/play";
import { useGameState } from "@/lib/useGameState";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlayed, setIsAudioPlayed] = useState<boolean>(false);
  const [srcAudio, setSrcAudio] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [playAgain, setPlayAgain] = useState<boolean>(false);

  useEffect(() => {
    if (playAgain) {
      chess.reset();
      setBoard(chess.board());
    }
  }, [playAgain]);

  const [gameState, setGameState] = useState<GameState>({
    isChecked: false,
    isCheckmated: false,
    isDrawn: false,
    isDrawnByFiftyMoves: false,
    isDrawnByMaterial: false,
    isStalemate: false,
    isThreeFoldRepetition: false,
    turn: "w",
  });
  const gameEndMessage = useGameState(gameState);

  useEffect(() => {
    if (isAudioPlayed && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
      setIsAudioPlayed(false);
    }
  }, [isAudioPlayed]);

  useEffect(() => {
    if (gameState.isCheckmated || gameState.isDrawn) {
      setSrcAudio(SOUNDS.GAMEEND);
      setShowMessage(true);
      setIsAudioPlayed(true);
    } else if (gameState.isChecked) {
      setSrcAudio(SOUNDS.CHECK);
      setIsAudioPlayed(true);
    }
  }, [gameState]);

  useEffect(() => {
    setGameState({
      ...gameState,
      isChecked: chess.inCheck(),
      isCheckmated: chess.isCheckmate(),
      isDrawn: chess.isDraw(),
      isDrawnByFiftyMoves: chess.isDrawByFiftyMoves(),
      isDrawnByMaterial: chess.isInsufficientMaterial(),
      isStalemate: chess.isStalemate(),
      isThreeFoldRepetition: chess.isThreefoldRepetition(),
      turn: chess.turn(),
    });
  }, [board]);

  const handleBoardClick = (event) => {
    setSelectedSquarePosition(event.target.dataset.square);
    setValidPieceMoves(
      chess.moves({ square: event.target.dataset.square, verbose: true })
    );
    // put a piece on a square if the piece had already been selected before
    if (selectedPiece !== undefined && selectedPiecePosition !== "") {
      if (chess.turn() == selectedPiece.color) {
        try {
          if (
            chess.get(event.target.dataset.square) !== undefined &&
            chess.get(event.target.dataset.square)?.color !==
              selectedPiece.color
          ) {
            // the opponent's piece is being capture at this move
            setSrcAudio(SOUNDS.CAPTURE);
            setIsAudioPlayed(true);
          } else if (event.target.dataset.square !== selectedPiecePosition) {
            setSrcAudio(SOUNDS.MOVESELF);
            setIsAudioPlayed(true);
          }
          chess.move({
            from: selectedPiecePosition,
            to: event.target.dataset.square,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setBoard(chess.board());
      setSelectedPiece(undefined);
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
        selectedPiecePosition={selectedPiecePosition}
        isInCheck={gameState.isChecked}
        turn={gameState.turn}
      />
      <audio className="hidden" ref={audioRef} src={srcAudio} />
      <GameEndAlert
        showMessage={showMessage}
        text={gameEndMessage}
        setShowMessage={setShowMessage}
        setPlayAgain={setPlayAgain}
      />
    </>
  );
}

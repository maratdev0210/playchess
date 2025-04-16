// Client-side of chess game

"use client";

import getUserData from "@/app/actions/getUserData";
import getGameData from "@/app/actions/getGameData";
import { useEffect, useState, useRef } from "react";
import { IGameData } from "@/types/game";
import { Chess, Move } from "chess.js";
import {
  DEFAULT_POSITION,
  IValiPieceMoves,
  IPiece,
  Board,
  GameState,
} from "@/types/play";
import ChessBoard from "@/app/ui/play/ChessBoard";
import MovesHistory from "@/app/ui/play/MovesHistory";
import GameEndAlert from "@/app/ui/play/GameEndAlert";
import { useGameState } from "@/lib/useGameState";
import { SOUNDS } from "@/types/play";
import updateGame from "@/app/actions/updateGame";

type IBoard = (Board | null)[][];
const chess = new Chess(DEFAULT_POSITION, { skipValidation: false });

export default function Play({
  gameId,
  userId,
}: {
  gameId: string;
  userId: number;
}) {
  const [username, setUsername] = useState<string>("");
  const [gameData, setGameData] = useState<IGameData | null>(null);

  // game data
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
  const [history, setHistory] = useState<Move[]>([]);
  const [activeMove, setActiveMove] = useState<number | undefined>();
  const [boardPositions, setBoardPositions] = useState<IBoard[]>([]); // stores the history of all played moves
  const [isHistory, setIsHistory] = useState<boolean>(false); // if the value is true, then preview the board not allowing the player to modify the board state
  useEffect(() => {
    const retrieveGameData = async () => {
      const result = await getGameData(gameId);
      // preload the moves that have been played if any
      if (result !== null && result.moves !== null) {
        setGameData(result);
        const movesHistory = result.moves;
        if (JSON.stringify(movesHistory) !== "{}") {
          // the game has at least one moves
          // so we have to restore it
          console.log("moves history is non-empty");
        }
      }
    };

    retrieveGameData();
  }, []);

  useEffect(() => {
    const retrieveUserData = async () => {
      const userData = await getUserData(userId);
      setUsername(userData.username);
    };

    retrieveUserData();
  }, []);

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
    if (activeMove + 1 < boardPositions.length) {
      setIsHistory(true);
    }
  }, [activeMove]);

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
    if (isHistory && activeMove + 1 < boardPositions.length) {
      return;
    }

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
            // the opponent's piece is being captured at this move
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
      // TO-DO: Update the Game database record here
      setBoard(chess.board());
      setBoardPositions([...boardPositions, chess.board()]);
      setHistory(chess.history({ verbose: true }));
      setActiveMove(boardPositions.length);
      setSelectedPiece(undefined);
    }
    if (selectedPiece === undefined) {
      setSelectedPiece(chess.get(event.target.dataset.square));
      setSelectedPiecePosition(event.target.dataset.square);
    }
  };

  // update the game record with new moves
  useEffect(() => {
    const updatedGame = async () => {
      const gameHistory = JSON.stringify(chess.history({ verbose: true }));
      const result = await updateGame(gameId, gameHistory);
      console.log(result);
    };

    updatedGame();
  }, [board]);

  useEffect(() => {
    const retreiveGameData = async () => {
      const result = await getGameData(gameId);

      //console.log("Game Data: " + result);
      console.log(JSON.parse(result.moves));
    };

    retreiveGameData();
  }, [board]);

  console.log(boardPositions);
  console.log(isHistory);
  console.log(activeMove);
  console.log(history);

  return (
    <>
      <div className="relative top-8 md:top-16 md:flex md:justify-center md:items-center gap-8 w-full">
        <div className="flex justify-center shadow-md rounded-lg">
          <ChessBoard
            board={isHistory ? boardPositions[activeMove] : board}
            handleBoardClick={handleBoardClick}
            validPieceMoves={validPieceMoves}
            selectedSquarePosition={selectedSquarePosition}
            selectedPiecePosition={selectedPiecePosition}
            isInCheck={gameState.isChecked}
            turn={gameState.turn}
            view="black"
          />
        </div>
        <div className="flex justify-center right-8 top-8 md:top-0">
          <MovesHistory
            history={history}
            activeMove={activeMove}
            setActiveMove={setActiveMove}
          />
        </div>
      </div>

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

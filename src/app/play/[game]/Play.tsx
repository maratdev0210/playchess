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
import { SOUNDS, IGameActionResponse, GAME_RESIGNATION, GAME_LOST_ON_TIME } from "@/types/play";
import updateGame from "@/app/actions/updateGame";
import { socket } from "@/socket";
import ChessBoardReversed from "@/app/ui/play/ChessBoardReversed";
import GameAction from "@/app/ui/play/GameAction";
import ManualGameEndAlert from "@/app/ui/play/ManualGameEndAlert";
import updateGameEndResults from "@/app/actions/updateGameResults";
import getRatingByUsername from "@/app/actions/getRatingByUsername";

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
  const [boardView, setBoardView] = useState<string>("white"); // default board view
  const [opponentUsername, setOpponentUsername] = useState<string>("");
  const [gameActionType, setGameActionType] = useState<string>(""); // resign or draw option
  const [showGameAction, setShowGameAction] = useState<boolean>(false);
  const [gameActionResponse, setGameActionResponse] =
    useState<IGameActionResponse | null>(null);
  const [showGameEndALert, setShowGameEndAlert] = useState<boolean>(false);
  const [gameEndResult, setGameEndResult] = useState<string>("");
  const [playerRating, setPlayerRating] = useState<number>(0);
  const [opponentRating, setOpponentRating] = useState<number>(0);
  const [playerSide, setPlayerSide] = useState<string | null>(null);
  const [opponentSide, setOpponentSide] = useState<string | null>(null);
  const [lostOnTime, setLostOnTime] = useState<string | null>(null); // who lost on time (either black or white)
  const [alternativeGameEndMessage, setAlternativeGameEndMessage] = useState<
    string | null
  >(null); // game end messages that are being shown after the player either resigns or loses on time
  const [showAlternativeText, setShowAlternativeText] =
    useState<boolean>(false); // display the alternative text only when the player manually resigns, or loses on time

  useEffect(() => {
    const retrieveGameData = async () => {
      const result = await getGameData(gameId);
      const userData = await getUserData(userId);
      setUsername(userData.username);
      setPlayerRating(userData.rating);
      // preload the moves that have been played if any
      if (result !== null && result.moves !== null) {
        setGameData(result);

        // change the board view if the user is playing for black
        if (userData.username === result.black) {
          setBoardView("black");
          setOpponentUsername(result.white);
          const rating = await getRatingByUsername(result.white);
          setOpponentRating(rating.rating);
          setPlayerSide("b");
          setOpponentSide("w");
        } else {
          setOpponentUsername(result.black);
          const rating = await getRatingByUsername(result.black);
          setOpponentRating(rating.rating);
          setPlayerSide("w");
          setOpponentSide("b");
        }
        const movesHistory = JSON.parse(result.moves);

        if (JSON.stringify(movesHistory) !== "{}") {
          // the game has at least one moves
          // so we have to restore it

          setHistory(movesHistory);
          movesHistory.map((pastMove) => {
            chess.move({
              from: pastMove.from,
              to: pastMove.to,
            });
          });
          setBoard(chess.board());
        }
      }
    };

    retrieveGameData();
  }, []);

  useEffect(() => {
    socket.on("whiteMove", (move) => {
      chess.move(move);
      setBoard(chess.board());
      setBoardPositions([...boardPositions, chess.board()]);
      setHistory(chess.history({ verbose: true }));
      setActiveMove(boardPositions.length);
    });

    socket.on("blackMove", (move) => {
      chess.move(move);
      setBoard(chess.board());
      setBoardPositions([...boardPositions, chess.board()]);
      setHistory(chess.history({ verbose: true }));
      setActiveMove(boardPositions.length);
    });
  });

  useEffect(() => {
    const updatedGame = async () => {
      const gameHistory = JSON.stringify(chess.history({ verbose: true }));
      const result = await updateGame(gameId, gameHistory);
    };

    updatedGame();
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
          if (chess.turn() === "w") {
            socket.emit("whiteMove", {
              from: selectedPiecePosition,
              to: event.target.dataset.square,
            });
          } else if (chess.turn() === "b") {
            socket.emit("blackMove", {
              from: selectedPiecePosition,
              to: event.target.dataset.square,
            });
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
    };

    updatedGame();
  }, [board]);

  useEffect(() => {
    const retreiveGameData = async () => {
      const result = await getGameData(gameId);
    };

    retreiveGameData();
  }, [board]);

  useEffect(() => {
    if (gameActionType !== "") {
      setShowGameAction(true);
    }
  }, [gameActionType]);

  useEffect(() => {
    if (gameActionResponse !== null) {
      if (
        gameActionResponse.type === "resign" &&
        gameActionResponse.response === "confirmed" &&
        gameData !== null
      ) {
        // white resigns the game
        if (gameData.white === username) {
          socket.emit("resignation", {
            from: "white",
          });
        } else {
          // black resigns the game
          socket.emit("resignation", {
            from: "black",
          });
        }
      }
    }
  }, [gameActionResponse]);

  useEffect(() => {
    if (lostOnTime !== null) {
      if (lostOnTime === "white") {
        socket.emit("resignation", {
          from: "white",
        });
      } else {
        socket.emit("resignation", {
          from: "black",
        });
      }
    }
  }, [lostOnTime]);

  useEffect(() => {
    // from shows which side resigned the game
    socket.on("resignation", (from) => {
      setShowGameEndAlert(true);
      setGameEndResult(GAME_RESIGNATION[from.from].message);
      updateGameEndResults(GAME_RESIGNATION[from.from].result, gameId);
    });
  });

  useEffect(() => {
    // from shows which side lost on time
    socket.on("lostOnTime", (from) => {
      setShowGameEndAlert(true);
      setGameEndResult(GAME_LOST_ON_TIME[from.from].message);
      updateGameEndResults(GAME_LOST_ON_TIME[from.from].result, gameId);
    });
  });

  useEffect(() => {
    if (lostOnTime !== null) {
      if (lostOnTime[0] === playerSide) {
        setShowMessage(true);
        setShowAlternativeText(true);
        setAlternativeGameEndMessage(`${lostOnTime} has lost on time!`);
        socket.emit("lostOnTime", {
          from: playerSide, // shows who lost on time
        });
      }
    }
  }, [lostOnTime]);

  console.log(boardPositions);
  console.log(isHistory);
  console.log(activeMove);
  console.log(history);

  return (
    <>
      <div className="relative top-8 md:top-16 md:flex md:justify-center md:items-center gap-8 w-full">
        <div className="flex justify-center shadow-md rounded-lg">
          {boardView === "white" ? (
            <ChessBoard
              board={isHistory ? boardPositions[activeMove] : board}
              handleBoardClick={handleBoardClick}
              validPieceMoves={validPieceMoves}
              selectedSquarePosition={selectedSquarePosition}
              selectedPiecePosition={selectedPiecePosition}
              isInCheck={gameState.isChecked}
              turn={gameState.turn}
            />
          ) : (
            <ChessBoardReversed
              board={isHistory ? boardPositions[activeMove] : board}
              handleBoardClick={handleBoardClick}
              validPieceMoves={validPieceMoves}
              selectedSquarePosition={selectedSquarePosition}
              selectedPiecePosition={selectedPiecePosition}
              isInCheck={gameState.isChecked}
              turn={gameState.turn}
            />
          )}
        </div>
        <div className="flex flex-col  justify-center right-8 top-8 md:top-0">
          <MovesHistory
            gameId={gameId}
            history={history}
            activeMove={activeMove}
            setActiveMove={setActiveMove}
            opponent={opponentUsername}
            player={username}
            boardView={boardView}
            setBoardView={setBoardView}
            setGameActionType={setGameActionType}
            playerRating={playerRating}
            opponentRating={opponentRating}
            side={chess.turn()}
            playerSide={playerSide}
            opponentSide={opponentSide}
            setLostOnTime={setLostOnTime}
          />
        </div>
      </div>

      <audio className="hidden" ref={audioRef} src={srcAudio} />
      <GameEndAlert
        showMessage={showMessage}
        text={gameEndMessage}
        alternativeText={alternativeGameEndMessage}
        showAlternativeText={showAlternativeText}
        setShowMessage={setShowMessage}
        setPlayAgain={setPlayAgain}
      />
      <GameAction
        type={gameActionType}
        showGameAction={showGameAction}
        setShowGameAction={setShowGameAction}
        setGameActionResponse={setGameActionResponse}
        setGameActionType={setGameActionType}
      />
      <ManualGameEndAlert
        showGameEndALert={showGameEndALert}
        setShowGameEndAlert={setShowGameEndAlert}
        text={gameEndResult}
      />
    </>
  );
}

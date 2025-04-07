// Determine the game state result

import { GameState, drawnStates, GameEndMessages } from "@/types/play";
import { useState, useEffect } from "react";

function useGameState(gameState: GameState) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (gameState.isCheckmated) {
      if (gameState.turn === "w") {
        setText("Black won by checkmate!");
      } else {
        setText("White won by checkmate!");
      }
    } else if (gameState.isDrawn) {
      for (const [key, value] of Object.entries(gameState)) {
        if (drawnStates.includes(key) && value !== false) {
          setText(GameEndMessages[drawnStates.indexOf(key)]);
        }
      }
    }
  }, [gameState]);

  return text;
}

export { useGameState };

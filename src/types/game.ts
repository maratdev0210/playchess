// Game Data for the current game

import { JsonValue } from "@prisma/client/runtime/library";

export interface IGameData {
    gameId: string;       
    id: number;
    result: string;      // draw or win (1-0 or 0-1)
    white: string;       // username of a player's on white side
    black: string;      // username of a player's on a black side
    moves: JsonValue;   // an array storing the previous moves that have been played out
    isActive: boolean;  // represents if the game is over or is currently being played
}

// Player's and opponent's clocks

"use client";

import { socket } from "@/socket";
import { useEffect, useState, useRef } from "react";
import getGameData from "@/app/actions/getGameData";
import { formatTime, formatSeconds } from "@/lib/utils";
import { clear } from "console";

interface IClock {
  gameId: string;
  player: string;
  side: string;
}

export default function Clock({ gameId, player, side }: IClock) {
  const [time, setTime] = useState<number | null>(null);
  const [playerSide, setPlayerSide] = useState<string | null>(null);
  const [shouldStop, setShouldStop] = useState<boolean>(false); // timer indicator
  const intervalRef = useRef(null);
  useEffect(() => {
    const retreiveGameData = async () => {
      const gameData = await getGameData(gameId);

      if (gameData !== null) {
        if (player === gameData.white) {
          setTime(gameData.whiteTime);
          setPlayerSide("white");
          setShouldStop(side !== "white")
        } else {
          setTime(gameData.blackTime);
          setPlayerSide("black");
          setShouldStop(side !== "black")
        }
      }
    };

    retreiveGameData();
  }, []);

//   useEffect(() => {
//     if (playerSide === side) {
//       setShouldStop(false);
//     } else {
//       setShouldStop(true);
//     }
//   }, [shouldStop]);

  const startTimer = () => {
    if (time !== null) {
      if (time > 0 && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
      }
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!shouldStop) {
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  });

  useEffect(() => {
    if (shouldStop) {
      stopTimer();
    }
  }, [shouldStop]);

  return (
    <>
      {time !== null && (
        <div className="w-60 py-1 px-2">
          <div className="w-full flex">
            <div>
              <span>{formatTime(time, 3600)}</span>
              <span>:</span>
            </div>
            <div>
              <span>{formatTime(time, 60)}</span>
              <span>:</span>
            </div>
            <div>
              <span>{formatSeconds(time)}</span>
              <span>:</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

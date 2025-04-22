// Player's and opponent's clocks

"use client";

import { useEffect, useState, useRef } from "react";
import getGameData from "@/app/actions/getGameData";
import { formatTime, formatSeconds } from "@/lib/utils";
import updateClocks from "@/app/actions/updateClocks";

interface IClock {
  gameId: string;
  opponentSide: string | null;
  side: string;
}

export default function OpponentClock({ gameId, opponentSide, side }: IClock) {
  const [time, setTime] = useState<number | null>(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const retrieveGameData = async () => {
      const result = await getGameData(gameId);

      if (result !== null) {
        if (opponentSide === "b") {
          setTime(result.blackTime);
        } else {
          setTime(result.whiteTime);
        }
      }
    };

    retrieveGameData();
  }, []);

  const startTimer = () => {
    if (time !== null) {
      if (time > 0 && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
      }

      const updatedClocks = updateClocks(gameId, opponentSide, time);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (opponentSide === side) {
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  });

  useEffect(() => {
    if (opponentSide !== side) {
      stopTimer();
    }
  });

  return (
    <>
      {time !== null && (
        <div className="w-60 py-2">
          <div className="w-24 justify-center py-2 px-1 flex border-1 shadow-md text-white bg-black rounded-lg">
            <div className="text-xl transition ease-in-out">
              <span>{formatTime(time, 3600)}</span>
              <span>:</span>
            </div>
            <div className="text-xl transition ease-in-out">
              <span>{formatTime(time, 60)}</span>
              <span>:</span>
            </div>
            <div className="text-xl transition ease-in-out">
              <span>{formatSeconds(time)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Player's and opponent's clocks

"use client";

import React, { useEffect, useState, useRef } from "react";
import getGameData from "@/app/actions/getGameData";
import { formatTime, formatSeconds } from "@/lib/utils";
import updateClocks from "@/app/actions/updateClocks";

interface IClock {
  gameId: string;
  playerSide: string | null;
  side: string;
  setLostOnTime: React.Dispatch<React.SetStateAction<string | null>>; // who lost on time (either black or white)
}

export default function Clock({
  gameId,
  playerSide,
  side,
  setLostOnTime,
}: IClock) {
  const [time, setTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const retrieveGameData = async () => {
      const result = await getGameData(gameId);

      if (playerSide === "w") {
        setTime(result.whiteTime);
      } else {
        setTime(result.blackTime);
      }
    };

    retrieveGameData();
  }, []);

  const startTimer = () => {
    if (time !== null && time > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
          }
          return prevTime - 1;
        });
      }, 1000);

      const updatedClocks = updateClocks(gameId, playerSide, time);
    }
  };

  useEffect(() => {
    if (time !== null) {
      if (time <= 0) {
        if (playerSide === "w") {
          setLostOnTime("white");
        } else {
          setLostOnTime("black");
        }
      }
    }
  }, [time]);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (playerSide === side) {
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
    if (playerSide !== side) {
      stopTimer();
    }
  });

  return (
    <>
      {time !== null && (
        <div className="w-60 py-2">
          <div className="w-24 justify-center py-2 px-1 flex border-1 shadow-md  text-black bg-white rounded-lg">
            <div className="text-xl transition ease-in-out font-semibold">
              <span>{formatTime(time, 3600)}</span>
              <span>:</span>
            </div>
            <div className="text-xl transition ease-in-out font-semibold">
              <span>{formatTime(time, 60)}</span>
              <span>:</span>
            </div>
            <div className="text-xl transition ease-in-out font-semibold">
              <span>{formatSeconds(time)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

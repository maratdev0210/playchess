// in-game chat room between two players

"use client";

import { IMessage } from "@/types/chat";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";
import { socket } from "@/socket";
import getGameData from "@/app/actions/getGameData";
import addMessage from "@/app/actions/addMessage";

interface IChat {
  username: string;
  gameId: string;
}

export default function Chat({ username, gameId }: IChat) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      const retrieveData = async () => {
        const gameData = await getGameData(gameId);
        if (gameData !== null) {
          if (gameData.messages !== null) {
            setMessages(gameData.messages);
          }
        }
      };

      retrieveData();
    });

    return () => {
      socket.off("sendMessage");
    };
  }, []);

  // load the message history on page refresh
  useEffect(() => {
    const retrieveGameData = async () => {
      const gameData = await getGameData(gameId);
      if (gameData !== null) {
        if (gameData.messages !== null) {
          setMessages(gameData.messages);
        }
      }
    };

    retrieveGameData();
  }, []);

  const sendMessageOnEnter = (event) => {
    if (event.code === "Enter" && message !== "") {
      // send the message if the message is not empty
      socket.emit("sendMessage", { username: username, content: message });
      const updateMessage = messages;
      updateMessage.push({ username: username, content: message });
      addMessage(gameId, updateMessage);
      setMessage("");
    }
  };

  // send message on button click
  const sendMessage = () => {
    socket.emit("sendMessage", { username: username, content: message });
    const updateMessage = messages;
    updateMessage.push({ username: username, content: message });
    addMessage(gameId, updateMessage);
    setMessage("");
  };

  return (
    <>
      <div className="w-90 h-110  rounded-md flex flex-col justify-between bg-gray-50 border-gray-300 border-1 relative">
        <div className="overflow-auto scrollbar">
          <div className="h-10 bg-black w-full flex items-center justify-center">
            <span className="text-center text-white block">Chat Room</span>
          </div>
          <div className="px-2 py-1 w-full">
            {messages !== undefined &&
              messages.map((message, index) => {
                return (
                  <div
                    className="flex gap-2 py-0.5 items-center justify-between"
                    key={index}
                  >
                    {message.username === "SYSTEM_MESSAGE" ? (
                      <p className="text-center">{message.content}</p>
                    ) : (
                      <>
                        <Link href={`/arena/${message.username}`}>
                          <span className="text-gray-600 text-sm font-bold">
                            {message.username}
                          </span>
                        </Link>
                        <span className="text-gray-500 font-semibold text-sm block">
                          {message.content}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="px-2 flex gap-2 justify-center items-center chat relative rounded-md bg-white h-16 ">
          <Input
            onKeyDown={(event) => sendMessageOnEnter(event)}
            onChange={(event) => setMessage(event.target.value)}
            value={message}
            className="w-full border-1 rounded-t-lg border-gray-200"
          />
          <div title="Send">
            <SendHorizonal
              onClick={() => sendMessage()}
              className="text-gray-500 cursor-pointer hover:transition hover:scale-105 hover:duration-300"
            />
          </div>
        </div>
      </div>
    </>
  );
}
